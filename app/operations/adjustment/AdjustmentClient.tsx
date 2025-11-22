"use client";

import { useState } from "react";
import { Settings, Calendar, User, MapPin, TrendingDown, TrendingUp, Plus } from "lucide-react";
import { createAdjustmentOperation, validateOperation } from "../../actions";
import { toast } from "sonner";

interface Product {
    id: string;
    name: string;
    sku: string;
}

interface Adjustment {
    id: string;
    reference: string;
    status: string;
    updatedAt: Date;
    moves: any[];
}

export default function AdjustmentClient({ initialAdjustments, products }: { initialAdjustments: Adjustment[], products: Product[] }) {
    const [viewMode, setViewMode] = useState<"list" | "form">("list");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [selectedProductId, setSelectedProductId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [type, setType] = useState<"GAIN" | "LOSS">("LOSS");

    async function handleCreate() {
        if (!selectedProductId || quantity <= 0) return;
        setIsSubmitting(true);

        const items = [{ productId: selectedProductId, quantity }];
        const res = await createAdjustmentOperation(items, type);

        if (res.success && res.operationId) {
            await validateOperation(res.operationId);
            toast.success("Adjustment validated successfully!");
            setViewMode("list");
            setSelectedProductId("");
            setQuantity(1);
        } else {
            alert(res.error);
        }
        setIsSubmitting(false);
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Adjustment Operations</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {viewMode === "list" ? "Fix inventory counts and handle losses" : "Create new inventory adjustment"}
                        </p>
                    </div>
                    <button
                        onClick={() => setViewMode(viewMode === "list" ? "form" : "list")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        {viewMode === "list" ? <><Plus className="w-4 h-4 inline mr-1" /> New Adjustment</> : "Back to List"}
                    </button>
                </div>
            </div>

            {viewMode === "list" ? (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-900">Recent Adjustments</h2>
                    </div>

                    <div className="divide-y divide-slate-200">
                        {initialAdjustments.map((adjustment) => {
                            // Determine type from moves (heuristic)
                            // If move source is INTERNAL -> LOSS
                            // If move dest is INTERNAL -> GAIN
                            const firstMove = adjustment.moves[0];
                            const isLoss = firstMove?.sourceLocationId && firstMove?.sourceLocation?.type === 'INTERNAL';
                            const moveType = isLoss ? "Loss" : "Found";
                            const moveQty = firstMove?.quantity || 0;
                            const productName = firstMove?.product?.name || "Unknown Product";

                            return (
                                <div key={adjustment.id} className="p-6 hover:bg-slate-50 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isLoss ? "bg-red-100" : "bg-green-100"}`}>
                                                {isLoss ? <TrendingDown className="w-6 h-6 text-red-600" /> : <TrendingUp className="w-6 h-6 text-green-600" />}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-900">{adjustment.reference} - {productName}</h3>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(adjustment.updatedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 pl-16 md:pl-0">
                                            <div className="text-left md:text-right">
                                                <p className={`text-2xl font-bold ${isLoss ? "text-red-600" : "text-green-600"}`}>
                                                    {isLoss ? "-" : "+"}{moveQty}
                                                </p>
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${isLoss ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                                    {moveType}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {initialAdjustments.length === 0 && (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Settings className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-slate-900 font-medium mb-1">No adjustments found</h3>
                                <p className="text-slate-500 text-sm mb-6">Create your first inventory adjustment.</p>
                                <button
                                    onClick={() => setViewMode("form")}
                                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    Create Adjustment
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Form View */
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden max-w-2xl mx-auto w-full">
                    <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex gap-2">
                            <button
                                onClick={handleCreate}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? "Validating..." : "Validate Adjustment"}
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Product</label>
                                <select
                                    value={selectedProductId}
                                    onChange={(e) => setSelectedProductId(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Product</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Adjustment Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as "GAIN" | "LOSS")}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="LOSS">Inventory Loss (Remove)</option>
                                    <option value="GAIN">Inventory Found (Add)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
