"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Truck,
  Package,
  History,
  Settings,
  ChevronDown,
  Hexagon,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  submenu?: { id: string; label: string; href: string }[];
}

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onClose }) => {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>("operations");

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
    },
    {
      id: "operations",
      label: "Operations",
      icon: Truck,
      href: "/operations",
      submenu: [
        { id: "receipt", label: "Receipt", href: "/operations/receipt" },
        { id: "delivery", label: "Delivery", href: "/operations/delivery" },
        { id: "adjustment", label: "Adjustment", href: "/operations/adjustment" },
      ],
    },
    {
      id: "stock",
      label: "Stock",
      icon: Package,
      href: "/stock",
    },
    {
      id: "move-history",
      label: "Move History",
      icon: History,
      href: "/move-history",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/settings",
      submenu: [
        { id: "warehouse", label: "Warehouse", href: "/settings/warehouse" },
        { id: "locations", label: "Locations", href: "/settings/locations" },
      ],
    },
  ];

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (item: MenuItem) => {
    if (pathname === item.href) return true;
    if (item.submenu) {
      return item.submenu.some((sub) => pathname === sub.href);
    }
    return false;
  };

  return (
    <aside className="flex flex-col w-72 h-screen bg-[#0f172a] text-slate-300 border-r border-slate-800 flex-shrink-0 transition-all duration-300 ease-in-out">
      {/* Logo Area */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800/60 bg-[#0f172a]">
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl mr-3 shadow-lg shadow-blue-500/20">
            <Hexagon className="w-6 h-6 text-white fill-white/20" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Kargo</h1>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Inventory OS</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-2 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
          Main Menu
        </p>
        {menuItems.map((item) => {
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isExpanded = expandedMenu === item.id;
          const parentActive = isParentActive(item);

          return (
            <div key={item.id} className="mb-1">
              {hasSubmenu ? (
                <button
                  onClick={() => toggleSubmenu(item.id)}
                  className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden ${parentActive
                    ? "text-white bg-slate-800/50 shadow-sm border border-slate-700/50"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/30"
                    }`}
                >
                  <div className="flex items-center z-10">
                    <item.icon
                      className={`w-5 h-5 mr-3 transition-colors ${parentActive
                        ? "text-blue-400"
                        : "text-slate-500 group-hover:text-slate-300"
                        }`}
                    />
                    {item.label}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 text-slate-500 ${isExpanded ? "rotate-180 text-blue-400" : ""
                      }`}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive(item.href)
                    ? "text-white bg-blue-600 shadow-lg shadow-blue-900/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/30"
                    }`}
                >
                  <item.icon
                    className={`w-5 h-5 mr-3 transition-colors ${isActive(item.href)
                      ? "text-white"
                      : "text-slate-500 group-hover:text-slate-300"
                      }`}
                  />
                  {item.label}
                </Link>
              )}

              {/* Submenu */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${hasSubmenu && isExpanded ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
                  }`}
              >
                <div className="ml-4 pl-4 border-l border-slate-800 space-y-1 py-1">
                  {item.submenu?.map((subItem) => (
                    <Link
                      key={subItem.id}
                      href={subItem.href}
                      className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${isActive(subItem.href)
                        ? "text-blue-400 bg-blue-500/10 font-medium translate-x-1"
                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30 hover:translate-x-1"
                        }`}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800/60 bg-[#0f172a]">
        {user ? (
          <form
            action={async () => {
              await import('@/app/lib/actions/auth-actions').then((mod) => mod.signOutAction());
            }}
          >
            <button className="flex items-center w-full px-4 py-3 bg-slate-900/50 hover:bg-slate-800 rounded-xl border border-slate-800 transition-all duration-200 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-slate-900 group-hover:ring-slate-700 transition-all">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="ml-3 text-left flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">{user.name || 'User'}</p>
                <p className="text-xs text-slate-500 truncate">Sign Out</p>
              </div>
              <Settings className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
            </button>
          </form>
        ) : (
          <Link href="/login" className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-200">
            Login / Sign Up
          </Link>
        )}
      </div>
    </aside>
  );
};
