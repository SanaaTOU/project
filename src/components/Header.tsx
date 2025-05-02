import React from 'react';
import { Bell, User, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  return (
    <header className="bg-white border-b border-gray-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          {/* Left: Hamburger button */}
          <div className="flex lg:hidden">
            <button
              className="text-gray-500 hover:text-gray-600"
              aria-controls="sidebar"
              aria-expanded="false"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Right: Header elements */}
          <div className="flex items-center space-x-3">
            <Link to="/notifications" className="relative p-2 text-gray-500 hover:text-primary-600 transition-colors">
              <Bell className="w-6 h-6" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></div>
            </Link>
            <div className="relative">
              <Link to="/settings" className="flex items-center p-2 text-gray-500 hover:text-primary-600 transition-colors">
                <User className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;