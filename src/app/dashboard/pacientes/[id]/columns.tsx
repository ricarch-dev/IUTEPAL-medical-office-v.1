'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/src/components/ui/button';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { ConsultData } from '@/src/types/consult-data';
import { formatDate } from '@/utils/form-date';
import { ViewConsult } from '@/src/components/view-consult';
import { ConsultUpdateModal } from '@/src/components/update-conuslt-modal';
import { Patients } from '@/src/types/patient';

export function columns({
  handleRefresh,
  patient,
}: {
  handleRefresh: () => void;
  patient: Patients;
}): ColumnDef<ConsultData>[] {
  return [
    {
      accessorKey: 'created_at',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Fecha de Consulta
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="lowercase">{formatDate(row.getValue('created_at'))}</div>,
    },
    {
      accessorKey: 'reason_consultation',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Motivo de Consulta
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue('reason_consultation')}</div>,
    },
    {
      accessorKey: 'diagnosis',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Diagnostico
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue('diagnosis')}</div>,
    },
    {
      accessorKey: 'pathology_id.name',
      header: 'Patología',
      cell: ({ row }) => <div className="capitalize">{row.original.pathology_id.name}</div>,
    },
    {
      accessorKey: 'pathology_system_id.name',
      header: 'Sistema Patológico',
      cell: ({ row }) => <div className="capitalize">{row.original.pathology_system_id.name}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const consultId = row.original.id;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="flex flex-col gap-y-2">
                <ViewConsult id={consultId}>
                  <Button variant={'ghost'}>
                    <p>Ver Datos completos</p>
                  </Button>
                </ViewConsult>
                <ConsultUpdateModal
                  initialData={{
                    height: row.original.height ? Number(row.original.height) : null,
                    weight: row.original.weight ? Number(row.original.weight) : null,
                    blood_type: row.original.blood_type,
                    temperature: row.original.temperature ? Number(row.original.temperature) : null,
                    pathology_system_id: row.original.pathology_system_id.id,
                    pathology_id: row.original.pathology_id.id,
                    reason_consultation: row.original.reason_consultation,
                    diagnosis: row.original.diagnosis,
                    medical_history: row.original.medical_history ?? false,
                    smoke: row.original.smoke ?? false,
                    drink: row.original.drink ?? false,
                    allergic: row.original.allergic ?? false,
                    discapacity: row.original.discapacity ?? false,
                    recipe_url: typeof row.original.recipe_url === 'string' ? undefined : row.original.recipe_url,
                  }}
                  isStudent={patient?.charge === 'Estudiante'}
                  onRefresh={handleRefresh}
                  id={consultId}
                >
                  <Button variant={'ghost'}>
                    <p>Modificar Datos</p>
                  </Button>
                </ConsultUpdateModal>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
