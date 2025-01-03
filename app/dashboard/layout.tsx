// app/dashboard/layout.tsx
import React from "react";
import { DashboardSidebar } from "./components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-red-50">
      <div className="flex">
        <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 ">{children}</main>
    </div>
    </div>    
  );
}
