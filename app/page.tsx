export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Kargo - Inventory Management System</h1>
      <p className="text-gray-600 mb-8">
        A high-performance Inventory Management System using Double-Entry Inventory tracking.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
          <p className="text-gray-600">View KPIs and recent activity</p>
        </div>
        
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Operations</h2>
          <p className="text-gray-600">Handle receipts, deliveries, and transfers</p>
        </div>
      </div>
    </div>
  );
}
