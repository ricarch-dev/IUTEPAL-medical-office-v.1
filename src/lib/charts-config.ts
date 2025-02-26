import { ChartConfig } from '../components/ui/chart';

export const chartConfigPatient = {
  desktop: {
    label: 'Pacientes',
    color: '#2563eb',
  },
} satisfies ChartConfig;

export const chartConfigPatientBySex = {
  desktop: {
    label: 'Masculino',
    color: '#2563eb',
  },
  mobile: {
    label: 'Femenino',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export const chartConfigPatientByAgeRange = {
  desktop: {
    label: 'Edades',
    color: '#2563eb',
  },
} satisfies ChartConfig;

export const chartConfigConsult = {
  desktop: {
    label: 'Consultas',
    color: '#2563eb',
  },
} satisfies ChartConfig;

export const chartConfigEvents = {
  desktop: {
    label: 'Citas medicas',
    color: '#2563eb',
  },
} satisfies ChartConfig;

export const chartConfigRecipe = {
  desktop: {
    label: 'Reposos',
    color: '#2563eb',
  },
} satisfies ChartConfig;

export const chartConfigPathology = {
  desktop: {
    label: 'Patologias',
    color: '#2563eb',
  },
} satisfies ChartConfig;
