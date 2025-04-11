// app/dashboard/layout.tsx
import React from "react";
import { DashboardSidebar } from "./components/dashboard-sidebar";
import ConnectWallet from "../components/ConnectWallet";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar />

        {/* Main content wrapper */}
        <div className="flex-1">
          {/* Header */}
          <header className=" px-8 py-4 border-b">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
              <h1 className="text-xl font-medium text-gray-800">Dashboard</h1>
              <div className="flex items-center gap-4">
                <ConnectWallet />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className=" max-w-7xl mx-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
