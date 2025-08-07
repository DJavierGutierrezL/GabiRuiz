import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Appointment, Client, Prices, AppointmentStatus } from '../types';
import { CalendarIcon } from './icons/CalendarIcon';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { UsersIcon } from './icons/UsersIcon';
import { PieChartIcon } from './icons/PieChartIcon';
import { GiftIcon } from './icons/GiftIcon';

interface DashboardProps {
  appointments: Appointment[];
  clients: Client[];
  prices: Prices;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md flex items-center transition-transform hover:scale-105">
    <div className={`p-3 sm:p-4 rounded-full mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl sm:text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const FilterButton: React.FC<{ label: string, isActive: boolean, onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            isActive ? 'bg-pink-500 text-white shadow' : 'bg-transparent text-gray-500 hover:bg-pink-100'
        }`}
    >
        {label}
    </button>
);


const Dashboard: React.FC<DashboardProps> = ({ appointments, clients, prices }) => {
    const [revenueFilter, setRevenueFilter] = useState<'week' | 'month' | 'day'>('week');

    const completedAppointments = appointments.filter(a => a.status === AppointmentStatus.Completed);
    const newClientsCount = clients.filter(c => c.isNew).length;

    const revenueData = useMemo(() => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const filtered = completedAppointments.filter(app => {
            const appDate = new Date(`${app.date}T00:00:00`);
            switch (revenueFilter) {
                case 'day': return appDate.toDateString() === today.toDateString();
                case 'week': return appDate >= startOfWeek;
                case 'month': return appDate.getMonth() === today.getMonth() && appDate.getFullYear() === today.getFullYear();
                default: return true;
            }
        });

        if (revenueFilter === 'week') {
            const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            const weekData = weekDays.map((day, index) => {
                const dayDate = new Date(startOfWeek);
                dayDate.setDate(startOfWeek.getDate() + index);
                const revenue = filtered
                    .filter(app => new Date(`${app.date}T00:00:00`).toDateString() === dayDate.toDateString())
                    .reduce((sum, app) => sum + (prices[app.service] || 0), 0);
                return { name: day, Ingresos: revenue };
            });
            return weekData;
        }

        if (revenueFilter === 'month') {
            const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
            const monthData = Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const revenue = filtered
                    .filter(app => new Date(`${app.date}T00:00:00`).getDate() === day)
                    .reduce((sum, app) => sum + (prices[app.service] || 0), 0);
                return { name: day.toString(), Ingresos: revenue };
            });
            return monthData;
        }
        
        if (revenueFilter === 'day') {
            const total = filtered.reduce((sum, app) => sum + (prices[app.service] || 0), 0);
            return [{ name: "Hoy", Ingresos: total }];
        }
        
        return [];

    }, [revenueFilter, completedAppointments, prices]);
    
    const totalFilteredRevenue = revenueData.reduce((sum, item) => sum + item.Ingresos, 0);
    
    const statusPieData = useMemo(() => {
        const counts = appointments.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {} as Record<AppointmentStatus, number>);

        const colors = {
            [AppointmentStatus.Pending]: '#facc15', // yellow-400
            [AppointmentStatus.Confirmed]: '#4ade80', // green-400
            [AppointmentStatus.Completed]: '#f472b6', // pink-400
            [AppointmentStatus.Cancelled]: '#f87171', // red-400
        };

        return Object.entries(counts).map(([name, value]) => ({
            name,
            value,
            fill: colors[name as AppointmentStatus],
        }));
    }, [appointments]);

    const birthdaysThisWeek = useMemo(() => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const datesOfWeek = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(startOfWeek);
            d.setDate(d.getDate() + i);
            return { month: d.getMonth(), day: d.getDate() };
        });

        return clients
            .filter(client => {
                if (!client.birthDate) return false;
                const birthDate = new Date(`${client.birthDate}T00:00:00`);
                const birthMonth = birthDate.getMonth();
                const birthDay = birthDate.getDate();
                return datesOfWeek.some(d => d.month === birthMonth && d.day === birthDay);
            })
            .sort((a, b) => {
                const dateA = new Date(`${a.birthDate}T00:00:00`);
                const dateB = new Date(`${b.birthDate}T00:00:00`);
                return dateA.getMonth() - dateB.getMonth() || dateA.getDate() - dateB.getDate();
            });
    }, [clients]);


  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
            title={`Ingresos (${revenueFilter === 'day' ? 'Hoy' : revenueFilter === 'week' ? 'Semana' : 'Mes'})`} 
            value={`$${totalFilteredRevenue.toFixed(2)}`} 
            icon={<DollarSignIcon className="w-6 h-6 text-green-800" />} 
            color="bg-green-200" 
        />
        <StatCard title="Citas Completadas (Total)" value={`${completedAppointments.length}`} icon={<CalendarIcon className="w-6 h-6 text-blue-800" />} color="bg-blue-200" />
        <StatCard title="Clientes Nuevos" value={`${newClientsCount}`} icon={<UsersIcon className="w-6 h-6 text-purple-800" />} color="bg-purple-200" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white p-4 sm:p-6 rounded-2xl shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-700 mb-2 sm:mb-0">Análisis de Ingresos</h3>
                <div className="flex space-x-1">
                    <FilterButton label="Día" isActive={revenueFilter === 'day'} onClick={() => setRevenueFilter('day')} />
                    <FilterButton label="Semana" isActive={revenueFilter === 'week'} onClick={() => setRevenueFilter('week')} />
                    <FilterButton label="Mes" isActive={revenueFilter === 'month'} onClick={() => setRevenueFilter('month')} />
                </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}/>
                    <Legend />
                    <Line type="monotone" dataKey="Ingresos" stroke="#f472b6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <PieChartIcon className="w-6 h-6 mr-2 text-purple-600" />
                Distribución de Citas
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {statusPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <GiftIcon className="w-6 h-6 mr-2 text-pink-500" />
            Cumpleaños de la Semana
        </h3>
        {birthdaysThisWeek.length > 0 ? (
            <ul className="space-y-3">
                {birthdaysThisWeek.map(client => (
                    <li key={client.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-pink-50 rounded-lg">
                        <span className="font-medium text-gray-800 mb-1 sm:mb-0">{client.name}</span>
                        <span className="text-sm text-pink-700 font-semibold">
                            {new Date(`${client.birthDate}T00:00:00`).toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </span>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-center text-gray-500 py-4">No hay cumpleaños esta semana.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;