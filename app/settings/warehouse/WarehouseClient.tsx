"use client";

import { Building2, MapPin, Package, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface WarehouseClientProps {
  initialWarehouses: any[];
}

export default function WarehouseClient({ initialWarehouses }: WarehouseClientProps) {
  const warehouses = initialWarehouses.map((wh) => ({
    id: wh.id,
    name: wh.name,
    shortCode: wh.name.substring(0, 2).toUpperCase(),
    type: wh.type,
    address: "123 Main Street, City A", // Placeholder as schema doesn't have address
    capacity: 1000, // Placeholder
    currentStock: 0, // Placeholder
    status: "Active",
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Warehouse Management</h1>
            <p className="text-sm text-slate-500 mt-1">
              Configure warehouse locations and details
            </p>
          </div>
          <button
            onClick={() => toast.success("Warehouse creation modal would open here")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Warehouse
          </button>
        </div>
      </div>

      {/* Warehouse Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {warehouses.map((warehouse) => {
          const capacityPercent = (warehouse.currentStock / warehouse.capacity) * 100;
          return (
            <div
              key={warehouse.id}
              onClick={() => toast.info(`Opening details for ${warehouse.name}`)}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  {warehouse.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {warehouse.name}
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Code: {warehouse.shortCode} • {warehouse.type}
              </p>

              <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{warehouse.address}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Capacity</span>
                  <span className="font-medium text-slate-900">
                    {warehouse.currentStock} / {warehouse.capacity}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${capacityPercent > 80
                      ? "bg-red-600"
                      : capacityPercent > 60
                        ? "bg-yellow-600"
                        : "bg-green-600"
                      }`}
                    style={{ width: `${capacityPercent}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500">
                  {capacityPercent.toFixed(0)}% utilized
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.info("Edit feature coming soon");
                  }}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.error("Cannot delete active warehouse");
                  }}
                  className="px-3 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Warehouse Details Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Warehouse Details</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Short Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {warehouses.map((warehouse) => (
                <tr
                  key={warehouse.id}
                  onClick={() => toast.info(`Opening details for ${warehouse.name}`)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-slate-900">
                        {warehouse.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {warehouse.shortCode}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {warehouse.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {warehouse.address}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {warehouse.currentStock} / {warehouse.capacity}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {warehouse.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info("Edit feature coming soon");
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.error("Cannot delete active warehouse");
                        }}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Package className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">
              This holds the multiple locations of warehouse, rooms etc.
            </h3>
            <p className="text-sm text-blue-700">
              Warehouses are internal locations where you store your inventory.
              You can add multiple warehouses and track stock across all locations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
