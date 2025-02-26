import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const translations: { [key: string]: string } = {
  id: 'Cedula',
  firts_name: 'Nombre',
  last_name: 'Apellido',
  dob: 'Fecha de Nacimiento',
  charge: 'Cargo',
  sex: 'Sexo',
  created_at: 'Fecha de Consulta',
  reason_consultation: 'Motivo de Consulta',
  diagnosis: 'Diagnostico',
};

export function translateColumnId(columnId: string): string {
  return translations[columnId] || columnId;
}

// Función para formatear la fecha
export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
}

// Función para convertir la primera letra a mayúscula
export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const formatDateConsult = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

export const formattedDate = new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'full',
  timeStyle: 'long',
}).format(new Date());

export const getInitialChartData = () => {
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];
  return months.map((month) => ({ month, desktop: 0 }));
};
