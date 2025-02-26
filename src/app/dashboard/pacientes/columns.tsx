'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/src/components/ui/button';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { Patients } from '@/src/types/patient';
import { PatientsCreateModal } from '@/src/components/create-patients-modal';
import Link from 'next/link';
import { formatDate } from '@/src/lib/utils';
import { ViewPatients } from '@/src/components/view-patients';

export function columns(handleRefresh: () => void): ColumnDef<Patients>[] {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Cedula
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'firts_name',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Nombre
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue('firts_name')}</div>,
    },
    {
      accessorKey: 'last_name',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Apellido
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue('last_name')}</div>,
    },
    {
      accessorKey: 'dob',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Fecha de Nacimiento
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const dob = row.getValue('dob');
        return <div className="ml-14 lowercase">{formatDate(dob as string)}</div>;
      },
    },
    {
      accessorKey: 'sex',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Sexo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue('sex')}</div>,
    },
    {
      accessorKey: 'charge',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Cargo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue('charge')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const patient = row.original;

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(patient.id)}>
                Copiar Cedula
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <div className="flex flex-col gap-y-2">
                <ViewPatients id={patient.id}>
                  <Button variant={'ghost'}>
                    <p>Ver Datos del paciente</p>
                  </Button>
                </ViewPatients>
                <Button variant={'ghost'}>
                  <Link href={`/dashboard/pacientes/${patient.id}`} passHref>
                    <p>Ver Consultas</p>
                  </Link>
                </Button>
                <Button variant={'ghost'}>
                  <PatientsCreateModal
                    onRefresh={handleRefresh}
                    sub="modificacion de un"
                    id={patient.id}
                    title="Modificar datos del paciente"
                  >
                    <p>Modificar Datos</p>
                  </PatientsCreateModal>
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
