import { prisma } from './prisma';

// --- Product Services ---

export async function createProductService(data: {
    name: string;
    sku: string;
    category: string;
    description?: string;
    minStock: number;
}) {
    const existing = await prisma.product.findUnique({
        where: { sku: data.sku },
    });

    if (existing) {
        throw new Error('Product with this SKU already exists');
    }

    return await prisma.product.create({
        data: {
            ...data,
            currentStock: 0,
        },
    });
}

export async function getProductStockService(productId: string) {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { currentStock: true },
    });
    return product?.currentStock || 0;
}

// --- Operations Services ---

async function generateOperationReference(type: 'RECEIPT' | 'DELIVERY' | 'ADJUSTMENT') {
    const count = await prisma.operation.count({
        where: { type },
    });
    const code = type === 'RECEIPT' ? 'IN' : type === 'DELIVERY' ? 'OUT' : 'ADJ';
    return `WH/${code}/${(count + 1).toString().padStart(4, '0')}`;
}

export async function createInboundOperationService(items: { productId: string; quantity: number }[]) {
    const vendor = await prisma.location.findFirst({ where: { type: 'VENDOR' } });
    const warehouse = await prisma.location.findFirst({ where: { type: 'INTERNAL' } });

    if (!vendor || !warehouse) throw new Error('Missing default locations');

    const reference = await generateOperationReference('RECEIPT');

    return await prisma.operation.create({
        data: {
            type: 'RECEIPT',
            status: 'DRAFT',
            reference,
            moves: {
                create: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    sourceLocationId: vendor.id,
                    destLocationId: warehouse.id,
                    status: 'DRAFT',
                })),
            },
        },
    });
}

export async function createOutboundOperationService(items: { productId: string; quantity: number }[]) {
    const warehouse = await prisma.location.findFirst({ where: { type: 'INTERNAL' } });
    const customer = await prisma.location.findFirst({ where: { type: 'CUSTOMER' } });

    if (!warehouse || !customer) throw new Error('Missing default locations');

    const reference = await generateOperationReference('DELIVERY');

    return await prisma.operation.create({
        data: {
            type: 'DELIVERY',
            status: 'DRAFT',
            reference,
            moves: {
                create: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    sourceLocationId: warehouse.id,
                    destLocationId: customer.id,
                    status: 'DRAFT',
                })),
            },
        },
    });
}

export async function createAdjustmentOperationService(items: { productId: string; quantity: number }[], type: 'GAIN' | 'LOSS') {
    const warehouse = await prisma.location.findFirst({ where: { type: 'INTERNAL' } });
    const inventoryLoss = await prisma.location.findFirst({ where: { type: 'INVENTORY_LOSS' } });

    if (!warehouse || !inventoryLoss) throw new Error('Missing default locations');

    const reference = await generateOperationReference('ADJUSTMENT');

    const sourceId = type === 'GAIN' ? inventoryLoss.id : warehouse.id;
    const destId = type === 'GAIN' ? warehouse.id : inventoryLoss.id;

    return await prisma.operation.create({
        data: {
            type: 'ADJUSTMENT',
            status: 'DRAFT',
            reference,
            moves: {
                create: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    sourceLocationId: sourceId,
                    destLocationId: destId,
                    status: 'DRAFT',
                })),
            },
        },
    });
}

export async function validateOperationService(operationId: string) {
    return await prisma.$transaction(async (tx: any) => {
        const operation = await tx.operation.findUnique({
            where: { id: operationId },
            include: {
                moves: {
                    include: {
                        product: true,
                        sourceLocation: true,
                        destLocation: true
                    }
                }
            },
        });

        if (!operation) throw new Error('Operation not found');
        if (operation.status === 'DONE') throw new Error('Operation already validated');

        // 1. Check Stock Availability for Outgoing Moves
        for (const move of operation.moves) {
            if (move.sourceLocation.type === 'INTERNAL' && move.destLocation.type !== 'INTERNAL') {
                if (move.product.currentStock < move.quantity) {
                    throw new Error(`Insufficient stock for ${move.product.name} (Requested: ${move.quantity}, Available: ${move.product.currentStock})`);
                }
            }
        }

        // 2. Update Operation and Moves Status
        await tx.operation.update({
            where: { id: operationId },
            data: { status: 'DONE' },
        });

        await tx.stockMove.updateMany({
            where: { operationId },
            data: { status: 'DONE' },
        });

        // 3. Update Product Stock based on Locations
        for (const move of operation.moves) {
            let adjustment = 0;

            const isSourceInternal = move.sourceLocation.type === 'INTERNAL';
            const isDestInternal = move.destLocation.type === 'INTERNAL';

            if (isDestInternal && !isSourceInternal) {
                // Incoming (Receipt or Gain)
                adjustment = move.quantity;
            } else if (isSourceInternal && !isDestInternal) {
                // Outgoing (Delivery or Loss)
                adjustment = -move.quantity;
            }
            // Internal Transfer (Internal -> Internal) results in 0 net change for the product globally, 
            // but if we tracked stock per location, we would handle it here. 
            // Since Product.currentStock is global, we ignore transfers.

            if (adjustment !== 0) {
                await tx.product.update({
                    where: { id: move.productId },
                    data: { currentStock: { increment: adjustment } },
                });
            }
        }
    });
}

// --- Ledger & Analytics Services ---

export async function getMoveHistoryService(productId?: string) {
    const where = productId ? { productId } : {};
    return await prisma.stockMove.findMany({
        where,
        include: {
            sourceLocation: true,
            destLocation: true,
            operation: true,
            product: true,
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function getLocationsService(type?: 'INTERNAL' | 'EXTERNAL') {
    const where = type === 'INTERNAL'
        ? { type: 'INTERNAL' }
        : type === 'EXTERNAL'
            ? { type: { in: ['VENDOR', 'CUSTOMER'] } }
            : {};

    return await prisma.location.findMany({
        where,
        orderBy: { name: 'asc' }
    });
}

export async function getDashboardMetricsService() {
    const [pendingOps, products] = await Promise.all([
        prisma.operation.count({ where: { status: 'DRAFT' } }),
        prisma.product.findMany(),
    ]);

    const lowStockCount = products.filter((p: { currentStock: number; minStock: number; }) => p.currentStock < p.minStock).length;
    const totalValue = 0;
    const totalProducts = products.length;

    return {
        pendingOps,
        lowStockCount,
        totalValue,
        totalProducts,
    };
}
