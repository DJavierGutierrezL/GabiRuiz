import { Client, Appointment, Product, AppointmentStatus } from '../types';

// Helper to get a birthday within the current week for demonstration
const getBirthdayInCurrentWeek = (offsetFromSunday: number): string => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const birthday = new Date(startOfWeek);
    birthday.setDate(birthday.getDate() + offsetFromSunday);
    // Random past year for realism
    const year = today.getFullYear() - (Math.floor(Math.random() * 20) + 22); // Age 22-41
    birthday.setFullYear(year);
    return birthday.toISOString().split('T')[0];
};

const getRandomPastDate = (startYear: number, endYear: number): string => {
    const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1; // Keep it simple, avoid month length issues
    return new Date(year, month, day).toISOString().split('T')[0];
}

export const mockClients: Client[] = [
  { id: 1, name: 'Elena Rodriguez', phone: '555-0101', email: 'elena.r@example.com', birthDate: getBirthdayInCurrentWeek(2), serviceHistory: ['Semi-permanente', 'Tradicional'], preferences: 'Prefiere tonos nude. Alergia al látex.', isNew: false },
  { id: 2, name: 'Sofia Garcia', phone: '555-0102', email: 'sofia.g@example.com', birthDate: getRandomPastDate(1990, 2002), serviceHistory: ['Acrílicas'], preferences: 'Le gustan los diseños florales.', isNew: false },
  { id: 3, name: 'Camila Hernandez', phone: '555-0103', email: 'camila.h@example.com', birthDate: getBirthdayInCurrentWeek(5), serviceHistory: ['Tradicional'], preferences: 'No le gusta el color amarillo.', isNew: true },
  { id: 4, name: 'Valentina Martinez', phone: '555-0104', email: 'valentina.m@example.com', birthDate: getRandomPastDate(1990, 2002), serviceHistory: ['Semi-permanente', 'Tradicional', 'Acrílicas'], preferences: 'Siempre pide extra brillo.', isNew: false },
  { id: 5, name: 'Isabella Lopez', phone: '555-0105', email: 'isabella.l@example.com', birthDate: getRandomPastDate(1990, 2002), serviceHistory: ['Tradicional'], preferences: 'Sensible en los pies.', isNew: true },
];

// Helper function to get a specific day of the *current* week
// dayOfWeek: 0 for Sunday, 1 for Monday, etc.
const getDayOfThisWeek = (dayOfWeek: number, hour: number, minute: number = 0): { date: string, time: string } => {
    const now = new Date();
    // Go to the beginning of the week (Sunday)
    now.setDate(now.getDate() - now.getDay());
    // Go to the target day
    now.setDate(now.getDate() + dayOfWeek);
    
    // Set the time
    now.setHours(hour, minute, 0, 0);

    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = now.toTimeString().substring(0, 5); // HH:MM

    return { date, time };
}


export const mockAppointments: Appointment[] = [
  { id: 1, clientName: 'Elena Rodriguez', service: 'Semi-permanente', ...getDayOfThisWeek(1, 10), status: AppointmentStatus.Confirmed }, // Monday at 10:00
  { id: 2, clientName: 'Sofia Garcia', service: 'Acrílicas', ...getDayOfThisWeek(1, 14), status: AppointmentStatus.Pending }, // Monday at 14:00
  { id: 3, clientName: 'Invitado', service: 'Tradicional', ...getDayOfThisWeek(2, 11), status: AppointmentStatus.Completed }, // Tuesday at 11:00
  { id: 4, clientName: 'Valentina Martinez', service: 'Retoque', ...getDayOfThisWeek(4, 16), status: AppointmentStatus.Cancelled }, // Thursday at 16:00
  { id: 5, clientName: 'Isabella Lopez', service: 'Semi-permanente', ...getDayOfThisWeek(4, 10), status: AppointmentStatus.Pending }, // Thursday at 10:00
];

export const mockProducts: Product[] = [
  { id: 1, name: 'Esmalte Rojo Pasión', currentStock: 15, minStock: 5 },
  { id: 2, name: 'Esmalte Blanco Nieve', currentStock: 8, minStock: 5 },
  { id: 3, name: 'Top Coat Brillante', currentStock: 4, minStock: 5 },
  { id: 4, name: 'Base Coat Fortalecedora', currentStock: 12, minStock: 5 },
  { id: 5, name: 'Aceite de Cutícula', currentStock: 20, minStock: 10 },
  { id: 6, name: 'Crema Hidratante de Manos', currentStock: 9, minStock: 10 },
  { id: 7, name: 'Removedor de Esmalte', currentStock: 25, minStock: 10 },
];