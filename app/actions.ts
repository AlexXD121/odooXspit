'use server';

import { revalidatePath } from 'next/cache';
import {
    createProductService,
    getProductStockService,
    createInboundOperationService,
    createOutboundOperationService,
    createAdjustmentOperationService,
    validateOperationService,
    getMoveHistoryService,
    getDashboardMetricsService,
    getLocationsService
} from './lib/services';

// --- Product Management ---

export async function createProduct(formData: FormData) {
    const name = formData.get('name') as string;
    const sku = formData.get('sku') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const minStock = parseInt(formData.get('minStock') as string) || 0;

    if (!name || !sku || !category) {
        return { error: 'Missing required fields' };
    }

    try {
        await createProductService({ name, sku, category, description, minStock });
        revalidatePath('/stock');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to create product:', error);
        return { error: error.message || 'Failed to create product' };
    }
}

export async function getProductStock(productId: string) {
    try {
        return await getProductStockService(productId);
    } catch (error) {
        console.error('Failed to get product stock:', error);
        return 0;
    }
}

// --- Operations Engine ---

export async function createInboundOperation(items: { productId: string; quantity: number }[]) {
    try {
        const operation = await createInboundOperationService(items);
        revalidatePath('/operations/receipts');
        return { success: true, operationId: operation.id };
    } catch (error: any) {
        console.error('Failed to create inbound operation:', error);
        return { error: error.message || 'Failed to create inbound operation' };
    }
}

export async function createOutboundOperation(items: { productId: string; quantity: number }[]) {
    try {
        const operation = await createOutboundOperationService(items);
        revalidatePath('/operations/deliveries');
        return { success: true, operationId: operation.id };
    } catch (error: any) {
        console.error('Failed to create outbound operation:', error);
        return { error: error.message || 'Failed to create outbound operation' };
    }
}

export async function createAdjustmentOperation(items: { productId: string; quantity: number }[], type: 'GAIN' | 'LOSS') {
    try {
        const operation = await createAdjustmentOperationService(items, type);
        revalidatePath('/operations/adjustment');
        return { success: true, operationId: operation.id };
    } catch (error: any) {
        console.error('Failed to create adjustment operation:', error);
        return { error: error.message || 'Failed to create adjustment operation' };
    }
}

export async function validateOperation(operationId: string) {
    try {
        await validateOperationService(operationId);
        revalidatePath('/stock');
        revalidatePath('/operations');
        return { success: true };
    } catch (error: any) {
        console.error('Validation failed:', error);
        return { error: error.message || 'Validation failed' };
    }
}

// --- Ledger & Analytics ---

export async function getMoveHistory(productId?: string) {
    try {
        return await getMoveHistoryService(productId);
    } catch (error) {
        console.error('Failed to fetch move history:', error);
        return [];
    }
}

export async function getLocations(type?: 'INTERNAL' | 'EXTERNAL') {
    try {
        return await getLocationsService(type);
    } catch (error) {
        console.error('Failed to fetch locations:', error);
        return [];
    }
}

export async function getDashboardMetrics() {
    try {
        return await getDashboardMetricsService();
    } catch (error) {
        console.error('Failed to fetch dashboard metrics:', error);
        return { pendingOps: 0, lowStockCount: 0, totalValue: 0, totalProducts: 0 };
    }
}
