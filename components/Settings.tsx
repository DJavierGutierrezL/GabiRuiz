import React, { useState, useEffect } from 'react';
import { SettingsIcon } from './icons/SettingsIcon';
import { UsersIcon } from './icons/UsersIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { Profile, Prices } from '../types';
import { PaletteIcon } from './icons/PaletteIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import ExcelUploader from './ExcelUploader';
import { UploadIcon } from './icons/UploadIcon';

interface SettingsProps {
  profile: Profile;
  prices: Prices;
  onSaveProfile: (profile: Profile) => void;
  onSavePrices: (prices: Prices) => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  onAppointmentsImported: (data: any[]) => void;
}

const Settings: React.FC<SettingsProps> = ({ profile, prices, onSaveProfile, onSavePrices, theme, onThemeChange, onAppointmentsImported }) => {
  const [profileForm, setProfileForm] = useState<Profile>(profile);
  const [pricesForm, setPricesForm] = useState<Prices>(prices);

  useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  useEffect(() => {
    setPricesForm(prices);
  }, [prices]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPricesForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(profileForm);
  };

  const handleSavePrices = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePrices(pricesForm);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 p-4 md:p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
          <SettingsIcon className="w-7 h-7 mr-3 text-gray-600 dark:text-gray-400" />
          Configuración General
        </h2>

        {/* Profile Settings */}
        <form onSubmit={handleSaveProfile} className="mb-8 p-4 md:p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
            <UsersIcon className="w-6 h-6 mr-3 text-pink-500" />
            Perfil de Usuario
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="salonName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre del Salón</label>
              <input type="text" id="salonName" name="salonName" value={profileForm.salonName} onChange={handleProfileChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tu Nombre</label>
              <input type="text" id="ownerName" name="ownerName" value={profileForm.ownerName} onChange={handleProfileChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div className="pt-2">
              <button type="submit" className="w-full sm:w-auto bg-pink-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-pink-600 transition-colors">
                Guardar Cambios de Perfil
              </button>
            </div>
          </div>
        </form>

        {/* Appearance Settings */}
        <div className="mb-8 p-4 md:p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
            <PaletteIcon className="w-6 h-6 mr-3 text-blue-500" />
            Apariencia
          </h3>
          <div className="flex space-x-2 rounded-lg bg-gray-200 dark:bg-gray-900/50 p-1">
            <button
                onClick={() => onThemeChange('light')}
                className={`w-full flex items-center justify-center space-x-2 rounded-md py-2 px-3 text-sm font-medium transition-all ${
                    theme === 'light' ? 'bg-white text-pink-600 shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50'
                }`}
            >
                <SunIcon className="w-5 h-5" />
                <span>Claro</span>
            </button>
            <button
                onClick={() => onThemeChange('dark')}
                className={`w-full flex items-center justify-center space-x-2 rounded-md py-2 px-3 text-sm font-medium transition-all ${
                    theme === 'dark' ? 'bg-gray-700 text-pink-500 shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-700/50'
                }`}
            >
                 <MoonIcon className="w-5 h-5" />
                 <span>Oscuro</span>
            </button>
          </div>
        </div>


        {/* Service Prices */}
        <form onSubmit={handleSavePrices} className="mb-8 p-4 md:p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
            <DollarSignIcon className="w-6 h-6 mr-3 text-green-500" />
            Precios de Servicios
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {Object.keys(pricesForm).map((service) => (
              <div key={service}>
                <label htmlFor={service} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{service}</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                   <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                     <span className="text-gray-500 sm:text-sm">$</span>
                   </div>
                   <input
                    type="number"
                    name={service}
                    id={service}
                    value={pricesForm[service]}
                    onChange={handlePriceChange}
                    className="block w-full rounded-md border-gray-300 pl-7 pr-4 py-2 focus:border-pink-500 focus:ring-pink-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-6">
            <button type="submit" className="w-full sm:w-auto bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-green-700 transition-colors">
              Guardar Precios
            </button>
          </div>
        </form>

        {/* Data Management */}
        <div className="mb-8 p-4 md:p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                <UploadIcon className="w-6 h-6 mr-3 text-blue-500" />
                Gestión de Datos
            </h3>
            <ExcelUploader onDataUploaded={onAppointmentsImported} />
        </div>


        {/* Notification Settings */}
        <div className="p-4 md:p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                <MegaphoneIcon className="w-6 h-6 mr-3 text-purple-500" />
                Notificaciones
            </h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Recordatorios de citas por email</span>
                    <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="relative w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-pink-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>
                 <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Alertas de bajo stock</span>
                     <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="relative w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-pink-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;