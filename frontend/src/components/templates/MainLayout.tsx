import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../organisms/Sidebar';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex">
          <div className="w-64 flex-shrink-0">
            <Sidebar />
          </div>
          <main className="flex-1">
            <div className="py-6">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout; 