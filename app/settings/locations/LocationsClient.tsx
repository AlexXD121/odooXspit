"use client";

import { useState } from "react";
import { MapPin, Users, Building, Trash, Edit, Plus } from "lucide-react";
import { toast } from "sonner";

interface LocationsClientProps {
  initialLocations: any[];
}

export default function LocationsClient({ initialLocations }: LocationsClientProps) {
  const [activeTab, setActiveTab] = useState("vendors");

  const vendors = initialLocations
    .filter((l) => l.type === 'VENDOR')
    .map((l) => ({
      id: l.id,
      name: l.name,
      code: `VEN-${l.id.substring(0, 4).toUpperCase()}`,
      contact: "John Doe", // Placeholder
      email: "vendor@example.com", // Placeholder
      phone: "+1 234 567 8900", // Placeholder
      address: "123 Vendor St", // Placeholder
    }));

  const customers = initialLocations
    .filter((l) => l.type === 'CUSTOMER')
    .map((l) => ({
      id: l.id,
      name: l.name,
      code: `CUS-${l.id.substring(0, 4).toUpperCase()}`,
      contact: "Jane Smith", // Placeholder
      email: "customer@example.com", // Placeholder
      phone: "+1 987 654 3210", // Placeholder
      address: "456 Customer Ave", // Placeholder
    }));

  const tabs = [
    { id: "vendors", label: "Vendors", count: vendors.length },
    { id: "customers", label: "Customers", count: customers.length },
  ];

  const currentData = activeTab === "vendors" ? vendors : customers;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white border border-brand-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-900">Location Management</h1>
            <p className="text-sm text-brand-500 mt-1">
              Manage vendors, customers, and other locations
            </p>
          </div>
          <button
            onClick={() => toast.success(`${activeTab === "vendors" ? "Vendor" : "Customer"} creation modal`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add {activeTab === "vendors" ? "Vendor" : "Customer"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                ? "bg-brand-900 text-white"
                : "bg-brand-50 text-brand-700 hover:bg-brand-100"
                }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Location Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentData.map((location) => (
          <div
            key={location.id}
            onClick={() => toast.info(`Opening details for ${location.name}`)}
            className="bg-white border border-brand-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-xl ${activeTab === "vendors"
                    ? "bg-purple-100"
                    : "bg-green-100"
                    }`}
                >
                  {activeTab === "vendors" ? (
                    <Building className="w-6 h-6 text-purple-600" />
                  ) : (
                    <Users className="w-6 h-6 text-green-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-900">
                    {location.name}
                  </h3>
                  <p className="text-sm text-brand-500">{location.code}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.info("Edit feature coming soon");
                  }}
                  className="p-2 border border-brand-200 rounded-lg hover:bg-brand-50 transition-colors"
                >
                  <Edit className="w-4 h-4 text-brand-600" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.error("Cannot delete active location");
                  }}
                  className="p-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <Users className="w-4 h-4 text-brand-500 mt-0.5" />
                <div>
                  <p className="text-brand-600">Contact Person</p>
                  <p className="text-brand-900 font-medium">{location.contact}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-brand-500 mt-0.5" />
                <div>
                  <p className="text-brand-600">Address</p>
                  <p className="text-brand-900">{location.address}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-brand-200 mt-3">
                <p className="text-xs text-brand-500 mb-1">Contact Details</p>
                <p className="text-sm text-brand-900">{location.email}</p>
                <p className="text-sm text-brand-900">{location.phone}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Locations Table */}
      <div className="bg-white border border-brand-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-brand-200">
          <h2 className="text-lg font-bold text-brand-900">
            {activeTab === "vendors" ? "Vendor" : "Customer"} Directory
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-brand-50 border-b border-brand-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-brand-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-brand-700 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-brand-700 uppercase tracking-wider">
                  Contact Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-brand-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-brand-700 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-brand-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200">
              {currentData.map((location) => (
                <tr
                  key={location.id}
                  onClick={() => toast.info(`Opening details for ${location.name}`)}
                  className="hover:bg-brand-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeTab === "vendors"
                          ? "bg-purple-100"
                          : "bg-green-100"
                          }`}
                      >
                        {activeTab === "vendors" ? (
                          <Building className="w-5 h-5 text-purple-600" />
                        ) : (
                          <Users className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <span className="font-medium text-brand-900">
                        {location.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-brand-900">
                    {location.code}
                  </td>
                  <td className="px-6 py-4 text-sm text-brand-900">
                    {location.contact}
                  </td>
                  <td className="px-6 py-4 text-sm text-brand-600">
                    {location.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-brand-600">
                    {location.phone}
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
                          toast.error("Cannot delete active location");
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
          <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">
              This holds the multiple locations of warehouse, rooms etc.
            </h3>
            <p className="text-sm text-blue-700">
              Manage your vendors (suppliers) and customers (buyers) here.
              These locations are used in receipt and delivery operations to track
              where goods come from and where they go.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
