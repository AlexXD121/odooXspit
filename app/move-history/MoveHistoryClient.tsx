"use client";

import { useState } from "react";
import { Search, List, LayoutGrid, ArrowRight, Package } from "lucide-react";
import { toast } from "sonner";

interface MoveHistoryClientProps {
  initialMovements: any[];
}

export default function MoveHistoryClient({ initialMovements }: MoveHistoryClientProps) {
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [searchQuery, setSearchQuery] = useState("");

  const movements = initialMovements.map((move) => ({
    id: move.id,
    reference: move.operation?.reference || "N/A",
    date: new Date(move.createdAt).toLocaleDateString('en-GB'),
    contact: move.sourceLocation.type === 'VENDOR' ? move.sourceLocation.name : move.destLocation.type === 'CUSTOMER' ? move.destLocation.name : "Internal",
    from: move.sourceLocation.name,
    to: move.destLocation.name,
    quantity: move.quantity,
    status: move.status,
    products: [move.product.name],
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white border border-brand-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-900">Move History</h1>
            <p className="text-sm text-brand-500 mt-1">
              By default land on List View
            </p>
          </div>
          <button
            onClick={() => toast.info("Manual move creation coming soon!")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            NEW
          </button>
        </div>

        {/* Search and View Toggle */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Allow user to search Delivery based on reference & contacts"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-brand-50 border border-brand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 bg-brand-50 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "list"
                ? "bg-white text-brand-900 shadow-sm"
                : "text-brand-500 hover:text-brand-900"
                }`}
              title="List View"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "kanban"
                ? "bg-white text-brand-900 shadow-sm"
                : "text-brand-500 hover:text-brand-900"
                }`}
              title="Kanban View - Allow user to switch to the kanban view based on status"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-200">
            {movements.map((move, index) => (
              <div
                key={index}
                onClick={() => toast.info(`Opening details for ${move.reference}`)}
                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-sm font-medium text-slate-900 block">{move.reference}</span>
                    <span className="text-xs text-slate-500">{move.date}</span>
                  </div>
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {move.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 mb-2">
                  <div>
                    <span className="text-xs text-slate-400 block">From</span>
                    {move.from}
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">To</span>
                    {move.to}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">{move.contact}</span>
                  <span className="font-medium text-slate-900">Qty: {move.quantity}</span>
                </div>
              </div>
            ))}
            {movements.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-slate-300" />
                </div>
                <h3 className="text-slate-900 font-medium mb-1">No moves found</h3>
                <p className="text-slate-500 text-sm">History is empty.</p>
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {movements.map((move, index) => (
                  <tr
                    key={index}
                    onClick={() => toast.info(`Opening details for ${move.reference}`)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {move.reference}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {move.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {move.contact}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {move.from}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {move.to}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {move.quantity}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {move.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {movements.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-slate-900 font-medium mb-1">No moves found</h3>
                      <p className="text-slate-500 text-sm">History is empty.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Info Box */}
          <div className="p-6 border-t border-slate-200 bg-slate-50">
            <div className="space-y-2 text-sm">
              <p className="text-slate-700">
                <span className="font-semibold">Traceability</span> is key. Every move is recorded here.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ready Column */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Ready</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                {movements.filter((m) => m.status === "Ready").length}
              </span>
            </div>
            <div className="space-y-3">
              {movements
                .filter((m) => m.status === "Ready")
                .map((move, index) => (
                  <div
                    key={index}
                    onClick={() => toast.info(`Opening details for ${move.reference}`)}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-900">
                        {move.reference}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        {move.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{move.contact}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                      <span>{move.from}</span>
                      <ArrowRight className="w-4 h-4" />
                      <span>{move.to}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{move.date}</span>
                      <span className="font-medium text-slate-900">
                        Qty: {move.quantity}
                      </span>
                    </div>
                    {move.products.length > 1 && (
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <p className="text-xs text-slate-500">
                          {move.products.length} products
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">In Progress</h3>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                0
              </span>
            </div>
            <div className="text-center py-8 text-slate-400 text-sm">
              No items in progress
            </div>
          </div>

          {/* Done Column */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Done</h3>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
                0
              </span>
            </div>
            <div className="text-center py-8 text-slate-400 text-sm">
              No completed items
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
