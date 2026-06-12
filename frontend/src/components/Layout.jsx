import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState } from "react";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--color-bg)" }}>
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex w-full min-w-0">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 md:ml-64 mt-16 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
