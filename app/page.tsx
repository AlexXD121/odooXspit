import {
  Package,
  TrendingDown,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Truck,
  AlertCircle,
} from "lucide-react";
import { getDashboardMetrics } from "./actions";
import { prisma } from "./lib/prisma";

export default async function Home() {
  const metrics = await getDashboardMetrics();

  const recentOperations = await prisma.operation.findMany({
    take: 5,
    orderBy: { updatedAt: 'desc' },
    include: { moves: { include: { product: true } } }
  });

  const kpiData = [
    {
      label: "Total Products",
      value: metrics.totalProducts.toString(),
      change: "+0%", // Placeholder
      trend: "up",
      icon: Package,
      color: "blue",
      description: "Active inventory items"
    },
    {
      label: "Low Stock Items",
      value: metrics.lowStockCount.toString(),
      change: "0%", // Placeholder
      trend: "down",
      icon: AlertCircle,
      color: "red",
      description: "Requires attention"
    },
    {
      label: "Pending Operations",
      value: metrics.pendingOps.toString(),
      change: "+0", // Placeholder
      trend: "up",
      icon: Clock,
      color: "amber",
      description: "To be processed"
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => (
          <div
            key={index}
            className="group bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${kpi.color}-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110`} />

            <div className="relative flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${kpi.color === "blue" ? "bg-blue-50 text-blue-600" :
                kpi.color === "red" ? "bg-red-50 text-red-600" :
                  "bg-amber-50 text-amber-600"
                }`}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center text-sm font-semibold px-2.5 py-1 rounded-full ${kpi.trend === "up" ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                }`}>
                {kpi.trend === "up" ? (
                  <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 mr-1" />
                )}
                {kpi.change}
              </div>
            </div>

            <div className="relative">
              <h3 className="text-slate-500 text-sm font-medium mb-1">{kpi.label}</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{kpi.value}</p>
                <span className="text-xs text-slate-400 font-medium">{kpi.description}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Operations Overview */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Receipts</h3>
              </div>
              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                {metrics.pendingOps} Pending
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Progress</span>
                <span className="text-slate-900 font-medium">65%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[65%] rounded-full" />
              </div>
              <div className="flex gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> 1 Late</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300"></span> 6 Total</span>
              </div>
            </div>

            <button className="w-full py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all">
              View All Receipts
            </button>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:border-emerald-200 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Truck className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Deliveries</h3>
              </div>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                {metrics.pendingOps} Pending
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Progress</span>
                <span className="text-slate-900 font-medium">80%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[80%] rounded-full" />
              </div>
              <div className="flex gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> 1 Late</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> 2 Waiting</span>
              </div>
            </div>

            <button className="w-full py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all">
              View All Deliveries
            </button>
          </div>
        </div>

        {/* Quick Actions / Promo */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />

          <div className="relative z-10">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-xl mb-2">AI Forecasting</h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              Predict stock shortages before they happen with our new AI-powered engine.
            </p>
          </div>

          <button className="relative z-10 bg-white text-blue-600 px-4 py-3 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors shadow-sm w-full">
            Try Pro Features
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <p className="text-sm text-slate-500">Latest inventory movements</p>
          </div>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
            View All
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentOperations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-medium mb-1">No operations yet</h3>
              <p className="text-slate-500 text-sm mb-6">Create your first receipt or delivery to see activity here.</p>
              <a href="/operations/receipt" className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
                Create Receipt
              </a>
            </div>
          ) : (
            recentOperations.map((op: any) => (
              <div
                key={op.id}
                className="group p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-center md:justify-between flex-col md:flex-row gap-4"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${op.type === "RECEIPT" ? "bg-blue-50 border-blue-100 text-blue-600" :
                    op.type === "DELIVERY" ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                      "bg-amber-50 border-amber-100 text-amber-600"
                    }`}>
                    {op.type === "RECEIPT" ? <Package className="w-5 h-5" /> :
                      op.type === "DELIVERY" ? <Truck className="w-5 h-5" /> :
                        <TrendingDown className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      {op.type} <span className="text-slate-400 font-normal mx-1">•</span> {op.reference}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>{new Date(op.updatedAt).toLocaleDateString()}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>Items: <span className="font-medium text-slate-700">{op.moves.length}</span></span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${op.status === "DONE"
                    ? "bg-slate-100 text-slate-600 border-slate-200"
                    : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}>
                    {op.status}
                  </span>
                  <button className="text-slate-300 hover:text-slate-600 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
