import React, { useState, useEffect } from 'react';
import { Page, Profile, Prices, Appointment, Client, Product, AppointmentStatus } from './types';
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
import KandyAI from './components/KandyAI';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);
  
  // Apply theme to HTML element and save to localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);


  // Centralized state
  const [profile, setProfile] = useState<Profile>({
    salonName: 'Manicurista Pro',
    ownerName: 'Ana Martínez',
  });

  const [prices, setPrices] = useState<Prices>({
    'Manos Semipermanente': 25,
    'Pies Semipermanente': 30,
    'Manos Tradicional': 15,
    'Pies Tradicional': 20,
    'Acrílicas': 40,
    'Retoque': 30,
    'Blindaje': 10,
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

  const handleAppointmentsImported = (importedData: any[]) => {
    const newAppointments: Appointment[] = importedData.map((item: any, index: number) => {
      let appointmentDate = new Date();
      if (item.date instanceof Date) {
        appointmentDate = item.date;
      } else if (typeof item.date === 'string') {
        appointmentDate = new Date(item.date);
      } else if (typeof item.date === 'number') {
        // Handle Excel's integer date format if cellDates is not used
         appointmentDate = new Date(Date.UTC(1900, 0, item.date - 1));
      }

      const validStatuses = Object.values(AppointmentStatus);
      const status = validStatuses.includes(item.status) ? item.status : AppointmentStatus.Pending;

      return {
        id: Date.now() + index,
        clientName: item.clientName?.toString() || 'Invitado',
        services: item.service ? [item.service.toString()] : ['No especificado'],
        date: appointmentDate.toISOString().split('T')[0],
        time: item.time?.toString() || '12:00',
        status: status,
      };
    }).filter(app => app.clientName !== 'Invitado' && !(app.services.length === 1 && app.services[0] === 'No especificado') && !isNaN(new Date(app.date).getTime()));

    if (newAppointments.length === 0 && importedData.length > 0) {
      alert("Los datos importados no tienen el formato correcto. Asegúrate de que las columnas 'clientName', 'service', 'date', 'time', y 'status' existan y tengan datos válidos.");
      return;
    }
    
    const updatedAppointments = [...newAppointments, ...appointments].sort((a,b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

    setAppointments(updatedAppointments);
    alert(`${newAppointments.length} citas han sido importadas y añadidas a la lista.`);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard appointments={appointments} clients={clients} prices={prices} theme={theme} />;
      case Page.Appointments:
        return <Appointments appointments={appointments} setAppointments={setAppointments} clients={clients} prices={prices} />;
      case Page.Clients:
        return <Clients clients={clients} setClients={setClients} />;
      case Page.Inventory:
        return <Inventory products={products} setProducts={setProducts} />;
      case Page.Marketing:
        return <Marketing clients={clients} appointments={appointments} />;
      case Page.Settings:
        return <Settings profile={profile} prices={prices} onSaveProfile={handleSaveProfile} onSavePrices={handleSavePrices} theme={theme} onThemeChange={setTheme} onAppointmentsImported={handleAppointmentsImported} />;
      default:
        return <Dashboard appointments={appointments} clients={clients} prices={prices} theme={theme}/>;
    }
  };

  return (
    <div className="flex h-screen bg-pink-50 font-sans dark:bg-gray-900">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex justify-between items-center bg-white/70 backdrop-blur-lg p-4 border-b border-gray-200 dark:bg-gray-800/70 dark:border-gray-700">
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 dark:text-gray-300">
            <MenuIcon className="h-6 w-6" />
          </button>
           <div className="flex items-center">
             <NailPolishIcon className="w-7 h-7 text-pink-600" />
             <h1 className="text-xl font-bold text-gray-800 ml-2 dark:text-gray-200">{profile.salonName}</h1>
           </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center mb-8">
              <div className="p-2 bg-pink-200 rounded-lg mr-4">
                 <NailPolishIcon className="w-8 h-8 text-pink-600" />
              </div>
              <div>
                   <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{profile.salonName}</h1>
                   <p className="text-gray-500 dark:text-gray-400">Your Complete Salon Management Suite</p>
              </div>
          </div>
          {renderPage()}
        </main>
      </div>
      <KandyAI 
        appointments={appointments}
        clients={clients}
        products={products}
        prices={prices}
      />
    </div>
  );
};

export default App;