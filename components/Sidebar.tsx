import React from 'react';
import { Page } from '../types';
import { DashboardIcon } from './icons/DashboardIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { UsersIcon } from './icons/UsersIcon';
import { BoxIcon } from './icons/BoxIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { NailPolishIcon } from './icons/NailPolishIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { LogOutIcon } from './icons/LogOutIcon';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isAction?: boolean;
}> = ({ icon, label, isActive, onClick, isAction }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
      isActive
        ? 'bg-pink-500 text-white shadow-md'
        : isAction 
        ? 'text-gray-500 hover:bg-red-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400'
        : 'text-gray-600 hover:bg-pink-100 hover:text-pink-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-pink-400'
    }`}
  >
    {icon}
    <span className="ml-4 font-medium">{label}</span>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isSidebarOpen, setIsSidebarOpen }) => {
  const navItems = [
    { id: Page.Dashboard, icon: <DashboardIcon className="w-6 h-6" />, label: 'Dashboard' },
    { id: Page.Appointments, icon: <CalendarIcon className="w-6 h-6" />, label: 'Citas' },
    { id: Page.Clients, icon: <UsersIcon className="w-6 h-6" />, label: 'Clientes' },
    { id: Page.Inventory, icon: <BoxIcon className="w-6 h-6" />, label: 'Inventario' },
    { id: Page.Marketing, icon: <MegaphoneIcon className="w-6 h-6" />, label: 'Marketing' },
  ];

  const handleLogout = () => {
    alert('Sesión cerrada (simulado).');
  };
  
  const handleItemClick = (page: Page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  }

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <aside className={`fixed inset-y-0 left-0 w-64 bg-white/70 backdrop-blur-lg p-4 shadow-lg flex flex-col justify-between transform transition-transform duration-300 ease-in-out z-30 
        md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        dark:bg-gray-800/70 dark:shadow-gray-950`}>
        <div>
          <div className="flex items-center justify-center my-6">
             <NailPolishIcon className="w-10 h-10 text-pink-600" />
            <span className="ml-3 text-2xl font-bold text-gray-800 dark:text-gray-200">Menú</span>
          </div>
          <nav>
            <ul>
              {navItems.map((item) => (
                <NavItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  isActive={currentPage === item.id}
                  onClick={() => handleItemClick(item.id)}
                />
              ))}
            </ul>
          </nav>
        </div>
        
        <div>
          <hr className="my-4 border-pink-100 dark:border-gray-700" />
          <ul>
              <NavItem
                  icon={<SettingsIcon className="w-6 h-6" />}
                  label="Ajustes"
                  isActive={currentPage === Page.Settings}
                  onClick={() => handleItemClick(Page.Settings)}
              />
              <NavItem
                  icon={<LogOutIcon className="w-6 h-6" />}
                  label="Cerrar Sesión"
                  isActive={false}
                  onClick={handleLogout}
                  isAction={true}
              />
          </ul>
          <div className="mt-4 text-center text-gray-400 text-xs dark:text-gray-500">
            <p>&copy; {new Date().getFullYear()} Manicurista Pro</p>
            <p>Diseñado con ❤️</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;