import React, { useState } from 'react';
import { Appointment, AppointmentStatus, Client } from '../types';
import { CalendarIcon } from './icons/CalendarIcon';
import { ClockIcon } from './icons/ClockIcon';
import Modal from './Modal';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

interface AppointmentsProps {
    appointments: Appointment[];
    setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
    clients: Client[];
}

const getStatusClasses = (status: AppointmentStatus) => {
    switch (status) {
        case AppointmentStatus.Confirmed:
            return {
                bubble: 'bg-green-400 hover:bg-green-500 text-white',
                badge: 'bg-green-100 text-green-800',
            };
        case AppointmentStatus.Completed:
            return {
                bubble: 'bg-pink-400 hover:bg-pink-500 text-white',
                badge: 'bg-pink-100 text-pink-800',
            };
        case AppointmentStatus.Cancelled:
            return {
                bubble: 'bg-red-400 hover:bg-red-500 text-white line-through',
                badge: 'bg-red-100 text-red-800',
            };
        case AppointmentStatus.Pending:
        default:
            return {
                bubble: 'bg-yellow-400 hover:bg-yellow-500 text-white',
                badge: 'bg-yellow-100 text-yellow-800',
            };
    }
};

const serviceOptions = ['Semi-permanente', 'Tradicional', 'Acrílicas', 'Retoque'];

const Appointments: React.FC<AppointmentsProps> = ({ appointments, setAppointments, clients }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [currentAppointment, setCurrentAppointment] = useState<Partial<Appointment> | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [historyFilterStatus, setHistoryFilterStatus] = useState<AppointmentStatus | 'All'>(AppointmentStatus.Completed);


  // --- Calendar Logic ---
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Start week on Sunday

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const weekDaysShort = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const calendarDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
  });
  
  // --- Helper Functions ---
  const formatTime12h = (time24h: string): string => {
    if (!time24h) return '';
    const [hoursStr, minutes] = time24h.split(':');
    const hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    let h12 = hours % 12;
    if (h12 === 0) h12 = 12; // the hour '0' should be '12'
    return `${h12}:${minutes} ${ampm}`;
  };

  const handleCloseModals = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setCurrentAppointment(null);
    setAppointmentToDelete(null);
  };

  const handleOpenAddModal = () => {
    setCurrentAppointment({
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      time: '10:00',
      clientName: clients[0]?.name || 'Invitado',
      service: serviceOptions[0],
      status: AppointmentStatus.Pending,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (appointment: Appointment) => {
    setAppointmentToDelete(appointment);
    setIsDeleteModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (currentAppointment) {
      setCurrentAppointment({ ...currentAppointment, [e.target.name]: e.target.value });
    }
  };

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAppointment) return;

    const { id, clientName, service, date, time, status } = currentAppointment;

    if (!clientName || !service || !date || !time || !status) {
      alert('Por favor, rellena todos los campos.');
      return;
    }

    let updatedAppointments;
    if (id) {
      updatedAppointments = appointments.map((a) => (a.id === id ? ({ ...a, ...currentAppointment } as Appointment) : a));
    } else {
      const newAppointment: Appointment = {
        id: Date.now(),
        clientName,
        service,
        date,
        time,
        status,
      };
      updatedAppointments = [newAppointment, ...appointments];
    }

    setAppointments(updatedAppointments.sort((a,b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
    }));

    handleCloseModals();
  };

  const handleDeleteConfirm = () => {
    if (appointmentToDelete) {
      setAppointments(appointments.filter((a) => a.id !== appointmentToDelete.id));
    }
    handleCloseModals();
  };
  
  const filteredHistoryAppointments = appointments
    .filter(appointment => {
        if (historyFilterStatus === 'All') return true;
        return appointment.status === historyFilterStatus;
    })
    .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateB.getTime() - dateA.getTime(); // Sort descending
    });

  return (
    <>
    <div className="bg-white p-4 md:p-8 rounded-2xl shadow-lg">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Gestión de Citas</h2>
        <button onClick={handleOpenAddModal} className="w-full md:w-auto bg-pink-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-pink-600 transition-colors">
            Añadir Cita
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Calendario Semanal</h3>
        <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
            <div className="hidden md:grid grid-cols-7 col-span-7 gap-2">
                {weekDays.map(day => <div key={day} className="font-bold text-gray-500">{day}</div>)}
            </div>
            <div className="grid md:hidden grid-cols-7 col-span-7 gap-1">
                {weekDaysShort.map(day => <div key={day} className="font-bold text-gray-500 text-sm">{day}</div>)}
            </div>
            {calendarDays.map((day, index) => {
                const dayAppointments = appointments.filter(a => {
                    const appointmentDate = new Date(`${a.date}T00:00:00`);
                    return appointmentDate.toDateString() === day.toDateString();
                });

                const isToday = day.toDateString() === new Date().toDateString();
                return (
                    <div key={index} className={`p-1 md:p-2 border rounded-lg min-h-24 md:min-h-32 ${isToday ? 'bg-pink-100 border-pink-300' : 'bg-gray-50'}`}>
                        <div className={`text-xs md:text-base font-bold text-right ${isToday ? 'text-pink-700' : 'text-gray-600'}`}>{day.getDate()}</div>
                        <div className="mt-1 space-y-1">
                            {dayAppointments.sort((a,b) => a.time.localeCompare(b.time)).map(app => {
                                const statusStyle = getStatusClasses(app.status);
                                return (
                                <button key={app.id} onClick={() => handleOpenEditModal(app)} className={`w-full text-xs rounded-md px-1 md:px-2 py-1 text-left overflow-hidden shadow transition-transform hover:scale-105 ${statusStyle.bubble}`}>
                                    <div className="font-bold truncate">{formatTime12h(app.time)}</div>
                                    <div className="truncate">{app.clientName}</div>
                                </button>
                            )})}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Próximas Citas</h3>
        <div className="space-y-4">
          {appointments.filter(a => new Date(a.date) >= new Date(new Date().toDateString())).map((appointment) => {
            const statusStyle = getStatusClasses(appointment.status);
            const isCancelled = appointment.status === AppointmentStatus.Cancelled;
            return (
              <div key={appointment.id} className="bg-pink-50 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-3 md:mb-0">
                  <p className={`font-bold text-pink-800 ${isCancelled ? 'line-through' : ''}`}>{appointment.clientName}</p>
                  <p className={`text-sm text-gray-600 ${isCancelled ? 'line-through' : ''}`}>{appointment.service}</p>
                   <span className={`mt-1 inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle.badge}`}>
                    {appointment.status}
                  </span>
                </div>
                <div className="text-left md:text-right mb-3 md:mb-0">
                   <div className="flex items-center text-sm text-gray-700">
                      <CalendarIcon className="w-4 h-4 mr-2 text-gray-500"/>
                      <span>{new Date(`${appointment.date}T00:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                   </div>
                   <div className="flex items-center text-sm text-gray-700">
                      <ClockIcon className="w-4 h-4 mr-2 text-gray-500"/>
                      <span>{formatTime12h(appointment.time)}</span>
                   </div>
                </div>
                 <div className="flex space-x-2 self-start md:self-center">
                   <button onClick={() => handleOpenEditModal(appointment)} className="text-blue-500 hover:text-blue-700 p-2"><i className="fas fa-edit"></i></button>
                   <button onClick={() => handleOpenDeleteModal(appointment)} className="text-red-500 hover:text-red-700 p-2"><i className="fas fa-trash"></i></button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-3 md:mb-0">Historial de Citas</h3>
            <div className='flex items-center'>
                 <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 mr-2">Filtrar:</label>
                 <select 
                    id="status-filter"
                    value={historyFilterStatus}
                    onChange={(e) => setHistoryFilterStatus(e.target.value as AppointmentStatus | 'All')}
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                 >
                    <option value="All">Todas</option>
                    {Object.values(AppointmentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
            </div>
        </div>
        <div className="space-y-4">
            {filteredHistoryAppointments.length > 0 ? (
                filteredHistoryAppointments.map((appointment) => {
                const statusStyle = getStatusClasses(appointment.status);
                const isCancelled = appointment.status === AppointmentStatus.Cancelled;
                return (
                  <div key={appointment.id} className="bg-gray-50 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div className="mb-3 md:mb-0">
                      <p className={`font-bold text-gray-800 ${isCancelled ? 'line-through' : ''}`}>{appointment.clientName}</p>
                      <p className={`text-sm text-gray-600 ${isCancelled ? 'line-through' : ''}`}>{appointment.service}</p>
                       <span className={`mt-1 inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle.badge}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="text-left md:text-right mb-3 md:mb-0">
                       <div className="flex items-center text-sm text-gray-700">
                          <CalendarIcon className="w-4 h-4 mr-2 text-gray-500"/>
                          <span>{new Date(`${appointment.date}T00:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                       </div>
                       <div className="flex items-center text-sm text-gray-700">
                          <ClockIcon className="w-4 h-4 mr-2 text-gray-500"/>
                          <span>{formatTime12h(appointment.time)}</span>
                       </div>
                    </div>
                     <div className="flex space-x-2 self-start md:self-center">
                       <button onClick={() => handleOpenEditModal(appointment)} className="text-blue-500 hover:text-blue-700 p-2"><i className="fas fa-edit"></i></button>
                       <button onClick={() => handleOpenDeleteModal(appointment)} className="text-red-500 hover:text-red-700 p-2"><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
                )
              })
            ) : (
                <div className="text-center text-gray-500 py-4">
                    No se encontraron citas con el estado seleccionado.
                </div>
            )}
        </div>
      </div>
    </div>

    <Modal
      isOpen={isModalOpen}
      onClose={handleCloseModals}
      title={currentAppointment?.id ? 'Editar Cita' : 'Añadir Nueva Cita'}
    >
      <form onSubmit={handleSaveAppointment} className="space-y-4">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
            Cliente
          </label>
          <select name="clientName" id="clientName" value={currentAppointment?.clientName || ''} onChange={handleFormChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" required>
            {clients.map((client) => (<option key={client.id} value={client.name}>{client.name}</option>))}
            <option value="Invitado">Invitado</option>
          </select>
        </div>
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">Servicio</label>
            <select
                name="service"
                id="service"
                value={currentAppointment?.service || ''}
                onChange={handleFormChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              >
              {serviceOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
              ))}
            </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input type="date" name="date" id="date" value={currentAppointment?.date || ''} onChange={handleFormChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" required />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
            <input type="time" name="time" id="time" value={currentAppointment?.time || ''} onChange={handleFormChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" required />
          </div>
        </div>
        <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select name="status" id="status" value={currentAppointment?.status || ''} onChange={handleFormChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" required>
                {Object.values(AppointmentStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button type="button" onClick={handleCloseModals} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-pink-500 text-white font-bold rounded-lg shadow hover:bg-pink-600">Guardar Cita</button>
        </div>
      </form>
    </Modal>

    <Modal isOpen={isDeleteModalOpen} onClose={handleCloseModals} title="Confirmar Eliminación">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <AlertTriangleIcon className="h-6 w-6 text-red-600" />
        </div>
        <p className="mt-4 text-gray-600">
          ¿Estás seguro de que quieres eliminar la cita de{' '}<strong>{appointmentToDelete?.clientName}</strong> para el servicio de{' '}<strong>{appointmentToDelete?.service}</strong>?
        </p>
        <p className="text-sm text-gray-500">Esta acción no se puede deshacer.</p>
      </div>
      <div className="mt-6 flex justify-center space-x-4">
        <button type="button" onClick={handleCloseModals} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</button>
        <button type="button" onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700">Sí, Eliminar</button>
      </div>
    </Modal>
  </>
  );
};

export default Appointments;