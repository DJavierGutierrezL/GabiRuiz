export enum AppointmentStatus {
  Pending = 'Pendiente',
  Confirmed = 'Confirmada',
  Completed = 'Completada',
  Cancelled = 'Cancelada',
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  serviceHistory: string[];
  preferences: string;
  isNew: boolean;
}

export interface Appointment {
  id: number;
  clientName: string;
  services: string[];
  date: string; 
  time: string;
  status: AppointmentStatus;
}

export interface Product {
  id: number;
  name: string;
  currentStock: number;
  minStock: number;
}

export interface Profile {
  salonName: string;
  ownerName: string;
}

export type Prices = Record<string, number>;

export enum Page {
  Dashboard = 'Dashboard',
  Appointments = 'Appointments',
  Clients = 'Clients',
  Inventory = 'Inventory',
  Marketing = 'Marketing',
  Settings = 'Settings',
}

export interface KandyAIMessage {
  sender: 'user' | 'kandy';
  text: string;
}
