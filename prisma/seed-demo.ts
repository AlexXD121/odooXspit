import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting Demo Seed...');

    // 1. Clean up existing data (optional, but good for demo consistency)
    // Be careful in production, but for a hackathon demo, this ensures a clean slate.
    await prisma.stockMove.deleteMany({});
    await prisma.operation.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.location.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('🧹 Database cleaned.');

    // 2. Create Locations
    const warehouse = await prisma.location.create({
        data: { name: 'Main Warehouse', type: 'INTERNAL' },
    });

    const vendor = await prisma.location.create({
        data: { name: 'Global Suppliers Inc.', type: 'VENDOR' },
    });

    const customer = await prisma.location.create({
        data: { name: 'Retail Clients', type: 'CUSTOMER' },
    });

    const inventoryLoss = await prisma.location.create({
        data: { name: 'Inventory Loss', type: 'INVENTORY_LOSS' },
    });

    console.log('📍 Locations created.');

    // 3. Create Products
    const products = await prisma.product.createManyAndReturn({
        data: [
            {
                name: 'Industrial Steel Rod',
                sku: 'MTL-ST-001',
                category: 'Raw Material',
                description: 'High-grade steel rod for construction.',
                price: 45.00,
                minStock: 50,
                currentStock: 80, // 100 in - 20 out
            },
            {
                name: 'Office Chair A1',
                sku: 'FUR-CH-001',
                category: 'Furniture',
                description: 'Ergonomic office chair with lumbar support.',
                price: 120.00,
                minStock: 10,
                currentStock: 0,
            },
            {
                name: 'Copper Wire 5mm',
                sku: 'ELE-WR-005',
                category: 'Electronics',
                description: 'Conductive copper wire for industrial use.',
                price: 15.50,
                minStock: 100,
                currentStock: 0, // Draft receipt only
            },
            {
                name: 'Safety Helmet',
                sku: 'SAF-HL-002',
                category: 'Safety Gear',
                description: 'Yellow safety helmet, impact resistant.',
                price: 25.00,
                minStock: 20,
                currentStock: 50,
            },
            {
                name: 'Hydraulic Pump',
                sku: 'MCH-PM-009',
                category: 'Machinery',
                description: 'Heavy-duty hydraulic pump.',
                price: 550.00,
                minStock: 5,
                currentStock: 0, // Low stock demo (0 < 5)
            },
        ],
    });

    // Map products by name for easy access
    const pSteel = products.find(p => p.name === 'Industrial Steel Rod')!;
    const pChair = products.find(p => p.name === 'Office Chair A1')!;
    const pCopper = products.find(p => p.name === 'Copper Wire 5mm')!;
    const pHelmet = products.find(p => p.name === 'Safety Helmet')!;
    const pPump = products.find(p => p.name === 'Hydraulic Pump')!;

    console.log('📦 Products created.');

    // 4. Create Stock History

    // Receipt: 100 Steel Rods (DONE)
    const receipt1 = await prisma.operation.create({
        data: {
            type: 'RECEIPT',
            status: 'DONE',
            reference: 'WH/IN/0001',
            sourceLocationId: vendor.id,
            destinationLocationId: warehouse.id,
            moves: {
                create: {
                    quantity: 100,
                    productId: pSteel.id,
                    sourceLocationId: vendor.id,
                    destLocationId: warehouse.id,
                    status: 'DONE',
                },
            },
        },
    });

    // Delivery: 20 Steel Rods (DONE)
    const delivery1 = await prisma.operation.create({
        data: {
            type: 'DELIVERY',
            status: 'DONE',
            reference: 'WH/OUT/0001',
            sourceLocationId: warehouse.id,
            destinationLocationId: customer.id,
            moves: {
                create: {
                    quantity: 20,
                    productId: pSteel.id,
                    sourceLocationId: warehouse.id,
                    destLocationId: customer.id,
                    status: 'DONE',
                },
            },
        },
    });

    // Receipt: 50 Safety Helmets (DONE) - just to have more data
    const receipt2 = await prisma.operation.create({
        data: {
            type: 'RECEIPT',
            status: 'DONE',
            reference: 'WH/IN/0002',
            sourceLocationId: vendor.id,
            destinationLocationId: warehouse.id,
            moves: {
                create: {
                    quantity: 50,
                    productId: pHelmet.id,
                    sourceLocationId: vendor.id,
                    destLocationId: warehouse.id,
                    status: 'DONE',
                },
            },
        },
    });

    console.log('📜 History created.');

    // 5. Create Draft Receipt (for Demo)
    // Receipt: Copper Wire (DRAFT)
    const draftReceipt = await prisma.operation.create({
        data: {
            type: 'RECEIPT',
            status: 'DRAFT',
            reference: 'WH/IN/0003',
            sourceLocationId: vendor.id,
            destinationLocationId: warehouse.id,
            moves: {
                create: {
                    quantity: 500,
                    productId: pCopper.id,
                    sourceLocationId: vendor.id,
                    destLocationId: warehouse.id,
                    status: 'DRAFT',
                },
            },
        },
    });

    console.log('📝 Draft Receipt created (Validate this in the demo!).');

    // 6. Low Stock Item
    // Hydraulic Pump is created with 0 stock and minStock 5.
    // No moves needed, it's already at 0.

    console.log('✅ Demo Seed Completed Successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
