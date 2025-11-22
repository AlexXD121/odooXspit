"use client";

import { useState } from "react";
import { Package, MapPin, Search, Filter, Plus, ArrowLeft } from "lucide-react";
import { createProduct } from "../actions";

interface Product {
    id: string;
    name: string;
    sku: string;
    category: string;
    currentStock: number;
    minStock: number;
    description: string | null;
}

export default function StockClient({ products }: { products: Product[] }) {
    const [viewMode, setViewMode] = useState<"list" | "form">("list");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        const res = await createProduct(formData);
        setIsSubmitting(false);
        if (res.success) {
            setViewMode("list");
        } else {
            alert(res.error);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Stock Overview</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {viewMode === "list" ? "Manage inventory items" : "Add new product"}
                        </p>
                    </div>
                    <button
                        onClick={() => setViewMode(viewMode === "list" ? "form" : "list")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${viewMode === "list"
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                    >
                        {viewMode === "list" ? <><Plus className="w-4 h-4" /> Add Product</> : <><ArrowLeft className="w-4 h-4" /> Back to List</>}
                    </button>
                </div>
            </div>

            {viewMode === "list" ? (
                /* Stock Table */
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">Stock List</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-slate-200">
                        {products.map((item) => (
                            <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Package className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{item.name}</p>
                                            <p className="text-xs text-slate-500">{item.sku}</p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.currentStock < item.minStock
                                        ? "bg-red-100 text-red-800"
                                        : "bg-green-100 text-green-800"
                                        }`}>
                                        {item.currentStock < item.minStock ? "Low" : "OK"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm pl-[52px]">
                                    <span className="text-slate-500">{item.category}</span>
                                    <div>
                                        <span className="font-medium text-slate-900">{item.currentStock}</span>
                                        <span className="text-slate-400 text-xs ml-1">/ {item.minStock} min</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {products.length === 0 && (
                            <div className="p-8 text-center text-slate-500">
                                No products found. Add one to get started.
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">SKU</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Stock Level</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {products.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                                                    <Package className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <p className="font-medium text-slate-900">{item.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{item.sku}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{item.category}</td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-slate-900">{item.currentStock}</span>
                                            <span className="text-slate-400 text-xs ml-1">/ {item.minStock} min</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.currentStock < item.minStock
                                                ? "bg-red-100 text-red-800"
                                                : "bg-green-100 text-green-800"
                                                }`}>
                                                {item.currentStock < item.minStock ? "Low Stock" : "In Stock"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                            No products found. Add one to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Form View */
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden max-w-2xl mx-auto w-full">
                    <form action={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
                                <input name="name" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">SKU</label>
                                <input name="sku" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                                <select name="category" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="Electronics">Electronics</option>
                                    <option value="Furniture">Furniture</option>
                                    <option value="Office Supplies">Office Supplies</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Min Stock Level</label>
                                <input name="minStock" type="number" defaultValue="10" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                            <textarea name="description" rows={3} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setViewMode("list")} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                {isSubmitting ? "Saving..." : "Save Product"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
