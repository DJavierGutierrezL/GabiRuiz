import React, { useState } from 'react';
import { Page, Profile, Prices, Appointment, Client, Product } from './types';
import { mockAppointments, mockClients, mockProducts } from './data/mockData';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Appointments from './components/Appointments';
import Clients from './components/Clients';
import Inventory from './components/Inventory';
import Marketing from './components/Marketing';
import Settings from './components/Settings';
import { NailPolishIcon } from './components/icons/NailPolishIcon';
import { MenuIcon } from './components/icons/MenuIcon';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Centralized state
  const [profile, setProfile] = useState<Profile>({
    salonName: 'Manicurista Pro',
    ownerName: 'Ana Martínez',
  });

  const [prices, setPrices] = useState<Prices>({
    'Semi-permanente': 25,
    'Tradicional': 15,
    'Acrílicas': 40,
    'Retoque': 30,
  });

  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const handleSaveProfile = (newProfile: Profile) => {
    setProfile(newProfile);
    alert('Perfil guardado exitosamente!');
  };

  const handleSavePrices = (newPrices: Prices) => {
    setPrices(newPrices);
    alert('Precios guardados exitosamente!');
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard appointments={appointments} clients={clients} prices={prices} />;
      case Page.Appointments:
        return <Appointments appointments={appointments} setAppointments={setAppointments} clients={clients} />;
      case Page.Clients:
        return <Clients clients={clients} setClients={setClients} />;
      case Page.Inventory:
        return <Inventory products={products} setProducts={setProducts} />;
      case Page.Marketing:
        return <Marketing clients={clients} appointments={appointments} />;
      case Page.Settings:
        return <Settings profile={profile} prices={prices} onSaveProfile={handleSaveProfile} onSavePrices={handleSavePrices} />;
      default:
        return <Dashboard appointments={appointments} clients={clients} prices={prices}/>;
    }
  };

  return (
    <div className="flex h-screen bg-pink-50 font-sans">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex justify-between items-center bg-white/70 backdrop-blur-lg p-4 border-b">
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
            <MenuIcon className="h-6 w-6" />
          </button>
           <div className="flex items-center">
             <NailPolishIcon className="w-7 h-7 text-pink-600" />
             <h1 className="text-xl font-bold text-gray-800 ml-2">{profile.salonName}</h1>
           </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center mb-8">
              <div className="p-2 bg-pink-200 rounded-lg mr-4">
                 <NailPolishIcon className="w-8 h-8 text-pink-600" />
              </div>
              <div>
                   <h1 className="text-3xl font-bold text-gray-800">{profile.salonName}</h1>
                   <p className="text-gray-500">Your Complete Salon Management Suite</p>
              </div>
          </div>
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;