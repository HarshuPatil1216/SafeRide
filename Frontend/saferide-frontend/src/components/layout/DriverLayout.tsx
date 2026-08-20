import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const DriverLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-[#e2e8f0] flex flex-col">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} title="SafeRide Driver Portal" />

        <main className="flex-1 p-3 sm:p-6 max-w-5xl w-full mx-auto pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
