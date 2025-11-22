"use client";

import { useState } from "react";
import { Search, List, LayoutGrid, Plus, X, Truck } from "lucide-react";
import { createOutboundOperation, validateOperation } from "../../actions";
import { toast } from "sonner";

interface Product {
    id: string;
    name: string;
    sku: string;
}

interface Delivery {
    id: string;
    reference: string;
    status: string;
    updatedAt: Date;
    moves: any[];
}

export default function DeliveryClient({ initialDeliveries, products }: { initialDeliveries: Delivery[], products: Product[] }) {
    const [viewMode, setViewMode] = useState<"list" | "form">("list");
    const [selectedItems, setSelectedItems] = useState<{ productId: string; quantity: number }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addItem = () => {
        if (products.length > 0) {
            setSelectedItems([...selectedItems, { productId: products[0].id, quantity: 1 }]);
        }
    };

    const removeItem = (index: number) => {
        setSelectedItems(selectedItems.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: 'productId' | 'quantity', value: string | number) => {
        const newItems = [...selectedItems];
        if (field === 'quantity') {
            newItems[index].quantity = Number(value);
        } else {
            newItems[index].productId = String(value);
        }
        setSelectedItems(newItems);
    };

    async function handleCreate(validate: boolean) {
        if (selectedItems.length === 0) return;
        setIsSubmitting(true);

        const res = await createOutboundOperation(selectedItems);
        if (res.success && res.operationId) {
            if (validate) {
                await validateOperation(res.operationId);
                toast.success("Delivery validated successfully!");
            } else {
                toast.success("Draft delivery created.");
            }
            setViewMode("list");
            setSelectedItems([]);
        } else {
            alert(res.error);
        }
        setIsSubmitting(false);
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Deliveries</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {viewMode === "list" ? "Manage outbound deliveries" : "Create new delivery"}
                        </p>
                    </div>
                    <button
                        onClick={() => setViewMode(viewMode === "list" ? "form" : "list")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        {viewMode === "list" ? "NEW" : "Back to List"}
                    </button>
                </div>
            </div>

            {viewMode === "list" ? (
                <>
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {initialDeliveries.map((delivery) => (
                            <div key={delivery.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="text-sm font-medium text-slate-900 block">{delivery.reference}</span>
                                        <span className="text-xs text-slate-500">{new Date(delivery.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${delivery.status === 'DONE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {delivery.status}
                                    </span>
                                </div>
                                <div className="text-sm text-slate-600 flex items-center gap-2">
                                    <Truck className="w-4 h-4" />
                                    {delivery.moves.length} items
                                </div>
                            </div>
                        ))}
                        {initialDeliveries.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Truck className="w-6 h-6 text-slate-300" />
                                </div>
                                <h3 className="text-slate-900 font-medium mb-1">No deliveries found</h3>
                                <button
                                    onClick={() => setViewMode("form")}
                                    className="mt-4 text-sm text-blue-600 font-medium"
                                >
                                    Create Delivery
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Reference</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Items</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {initialDeliveries.map((delivery) => (
                                        <tr key={delivery.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-slate-900">{delivery.reference}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{new Date(delivery.updatedAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${delivery.status === 'DONE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {delivery.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{delivery.moves.length} items</td>
                                        </tr>
                                    ))}
                                    {initialDeliveries.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Truck className="w-8 h-8 text-slate-300" />
                                                </div>
                                                <h3 className="text-slate-900 font-medium mb-1">No deliveries found</h3>
                                                <p className="text-slate-500 text-sm mb-6">Create your first outbound delivery to get started.</p>
                                                <button
                                                    onClick={() => setViewMode("form")}
                                                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
                                                >
                                                    Create Delivery
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleCreate(true)}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? "Validating..." : "Validate"}
                            </button>
                            <button
                                onClick={() => handleCreate(false)}
                                disabled={isSubmitting}
                                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                            >
                                Save Draft
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className="px-4 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="border-t border-slate-200 pt-6">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Products</h3>
                            <div className="space-y-3">
                                {selectedItems.map((item, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-4">
                                        <div className="col-span-8">
                                            <select
                                                value={item.productId}
                                                onChange={(e) => updateItem(index, 'productId', e.target.value)}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {products.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-span-3">
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="col-span-1 flex items-center">
                                            <button onClick={() => removeItem(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addItem} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Line
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
