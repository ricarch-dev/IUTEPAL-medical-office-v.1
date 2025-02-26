'use client';

import * as React from 'react';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { Input } from '@/src/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Skeleton } from '@/src/components/ui/skeleton';
import { columns } from './columns';
import { ConsultCreateModal } from '@/src/components/create-consult-modal';
import { useParams } from 'next/navigation';
import { translateColumnId } from '@/src/lib/utils';
import { Patients } from '@/src/types/patient';

export function DataTablePatienConsult() {
  const { id } = useParams() as { id: string };
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [refresh, setRefresh] = React.useState(false);
  const [patient, setPatient] = React.useState<Patients | null>(null);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const response = await fetch(`/api/consultas?patient_id=${id}`);
      const result = await response.json();
      setData(result.data || []);
      setLoading(false);
    }
    fetchData();
  }, [refresh, id]);

  React.useEffect(() => {
    async function fetchPatient() {
      const response = await fetch(`/api/pacientes?id=${id}`);
      const result = await response.json();
      setPatient(result.data[0] || null);
    }
    fetchPatient();
  }, [id]);

  const table = useReactTable({
    data: data,
    columns: columns({ handleRefresh, patient: patient || ({} as Patients) }),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="w-full">
      {loading ? (
        <Skeleton className="mb-4 h-10 w-full bg-sky-100" />
      ) : (
        <div className="flex items-center py-4">
          <Input
            placeholder="Buscar..."
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Filtrar <ChevronDown className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {translateColumnId(column.id)}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <ConsultCreateModal
            id={id}
            onRefresh={handleRefresh}
            title="Crear nueva consulta"
            sub="no se que es esto?"
            isStudent={patient?.charge === 'Estudiante'}
          >
            <Button className="ml-5">Agregar Nueva Consulta</Button>
          </ConsultCreateModal>
        </div>
      )}

      {loading ? (
        <Skeleton className="h-96 bg-sky-100" />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No se encuentra ninguna consulta registrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      {loading ? (
        <Skeleton className="mt-4 h-10 w-full bg-sky-100" />
      ) : (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} fila(s)
            seleccionada.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
