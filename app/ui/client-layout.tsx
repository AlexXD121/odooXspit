"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "sonner";
import { Menu, X } from "lucide-react";

interface ClientLayoutProps {
    children: React.ReactNode;
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export default function ClientLayout({ children, user }: ClientLayoutProps) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isAuthPage = pathname === "/login" || pathname === "/register";

    // If it's an auth page, render without dashboard layout
    if (isAuthPage) {
        return <>{children}</>;
    }

    // For all other pages, use dashboard layout
    return (
        <div className="flex h-screen w-full bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Hidden on mobile unless open */}
            <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}>
                <Sidebar user={user} onClose={() => setIsMobileMenuOpen(false)} />
            </div>

            <main className="flex-1 flex flex-col h-screen overflow-hidden w-full">
                {/* Top Header */}
                <header className="h-16 px-4 md:px-8 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center text-slate-500 text-sm">
                            <span className="font-medium text-slate-900">Dashboard</span>
                            <span className="mx-2">/</span>
                            <span>Overview</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300"></div>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                    <div className="max-w-[1920px] mx-auto">
                        {children}
                    </div>
                </div>
            </main>
            <Toaster position="top-right" />
        </div>
    );
}
