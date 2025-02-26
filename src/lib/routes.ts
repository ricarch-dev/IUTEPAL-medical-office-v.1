import { BarChart, CalendarIcon, Dna, FileTextIcon, HomeIcon, UsersIcon, WalletIcon } from 'lucide-react';

// Depending on the size of the application, this would be stored in a database.
export const links = [
  { name: 'Inicio', href: '/dashboard', icon: HomeIcon },
  { name: 'Pacientes', href: '/dashboard/pacientes', icon: UsersIcon },
  {
    name: 'Calendario',
    href: '/dashboard/calendario',
    icon: CalendarIcon,
  },
  {
    name: 'Reposos',
    href: '/dashboard/reposos',
    icon: FileTextIcon,
  },
  { name: 'Reportes', href: '/dashboard/reportes', icon: BarChart },
  // { name: 'Inventario', href: '/dashboard/inventario', icon: WalletIcon },
  { name: 'Patologias', href: '/dashboard/patologias', icon: Dna },
  // ! do not move this route up
  { name: 'Perfil', href: '/dashboard/perfil', icon: UsersIcon },
];
