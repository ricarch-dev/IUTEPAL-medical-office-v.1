'use client';
import { CreatePathologyModal } from '@/src/components/create-pathology-modal';
import { Button } from '@/src/components/ui/button';
import { capitalizeFirstLetter } from '@/src/lib/utils';
import { PathologySystem } from '@/src/types/system-pathology';
import { PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ConfirmDeleteModal } from '@/src/components/confirm-delete-modal';

interface Pathology {
  id: number;
  name: string;
  pathology_system_id: number;
}

const ITEMS_PER_PAGE = 10;

export default function Page() {
  const [systemPathology, setSystemPathology] = useState<PathologySystem[]>([]);
  const [pathologies, setPathologies] = useState<Pathology[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    try {
      const [systemsResponse, pathologiesResponse] = await Promise.all([
        fetch('/api/sistema'),
        fetch('/api/patologias'),
      ]);

      const systemsData = await systemsResponse.json();
      const pathologiesData = await pathologiesResponse.json();

      console.log('Systems Data:', systemsData);
      console.log('Pathologies Data:', pathologiesData);

      setSystemPathology(Array.isArray(systemsData) ? systemsData : []);
      setPathologies(Array.isArray(pathologiesData.data) ? pathologiesData.data : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSystemChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSystem(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when system changes
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch('/api/patologias', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setPathologies((prevPathologies) => prevPathologies.filter((pathology) => pathology.id !== id));
      } else {
        console.error('Error deleting pathology');
      }
    } catch (error) {
      console.error('Error deleting pathology:', error);
    }
  };

  const filteredPathologies = pathologies.filter((pathology) => pathology.pathology_system_id === selectedSystem);
  const totalPages = Math.ceil(filteredPathologies.length / ITEMS_PER_PAGE);
  const displayedPathologies = filteredPathologies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-end">
        <CreatePathologyModal title="Sistema Patologia" onRefresh={fetchData}>
          <Button variant={'default'}>
            <PlusIcon className="size-6" aria-hidden="true" />
            Agregar
          </Button>
        </CreatePathologyModal>
      </div>
      <div className="mb-5 w-full">
        <label htmlFor="system-select" className="block text-sm font-medium text-gray-700">
          Seleccione un sistema patológico
        </label>
        <select
          id="system-select"
          onChange={handleSystemChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Seleccione un sistema patológico</option>
          {systemPathology.map((system) => (
            <option key={system.id} value={system.id}>
              {system.name}
            </option>
          ))}
        </select>
      </div>
      <div className="my-5 w-full">
        {selectedSystem !== null && (
          <>
            {displayedPathologies.length > 0 ? (
              <ul className="space-y-2">
                {displayedPathologies.map((pathology) => (
                  <li
                    key={pathology.id}
                    className="flex justify-between rounded-md border border-gray-300 bg-white p-4 shadow-sm"
                  >
                    {capitalizeFirstLetter(pathology.name)}
                    <ConfirmDeleteModal onConfirm={() => handleDelete(pathology.id)}>
                      <button className="text-red-500">X</button>
                    </ConfirmDeleteModal>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500">No hay actualmente patologías disponibles</div>
            )}
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-md bg-gray-200 px-4 py-2 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-md bg-gray-200 px-4 py-2 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
