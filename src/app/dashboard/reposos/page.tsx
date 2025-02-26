'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';
import { UploadRecipeModal } from '@/src/components/upload-recipe-modal';
import { CreateRecipeModal } from '@/src/components/create-recipe-modal';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/src/components/ui/accordion';

interface Reposo {
  id: string;
  patient_id: string;
  recipe_url: string;
  consultation_id: string;
  description: string;
}

interface GroupedReposos {
  patient_id: string;
  reposos: Reposo[];
}

export default function Page() {
  const [reposos, setReposos] = useState<Reposo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReposos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reposos');
      const data = await res.json();
      if (Array.isArray(data.data)) {
        setReposos(data.data);
      } else {
        console.error('Unexpected response format:', data);
      }
    } catch (error) {
      console.error('Error fetching reposos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReposos();
  }, []);

  // Agrupar los reposos por patient_id
  const groupedReposos: GroupedReposos[] = reposos.reduce((acc: GroupedReposos[], reposo) => {
    const existingGroup = acc.find((group) => group.patient_id === reposo.patient_id);
    if (existingGroup) {
      existingGroup.reposos.push(reposo);
    } else {
      acc.push({ patient_id: reposo.patient_id, reposos: [reposo] });
    }
    return acc;
  }, []);

  return (
    <section>
      <div className="mt-4 flex justify-end space-x-5 sm:ml-16 sm:mt-0 sm:flex-none">
        <UploadRecipeModal onRecipeImported={fetchReposos}>
          <Button variant="default">Importar Reposo</Button>
        </UploadRecipeModal>
        <CreateRecipeModal onRecipeCreated={fetchReposos}>
          <Button variant="default">Crear nuevo reposo</Button>
        </CreateRecipeModal>
      </div>
      {loading ? (
        <p className="mt-3">Cargando reposos...</p>
      ) : groupedReposos.length === 0 ? (
        <p className="mt-3">No se encuentran Reposos registrados Actualmente.</p>
      ) : (
        <>
          <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
            Reposos Disponibles
          </h3>
          <Accordion type="single" collapsible>
            {groupedReposos.map((group) => (
              <AccordionItem key={group.patient_id} value={group.patient_id}>
                <AccordionTrigger>{`Reposos del Paciente con cedula: ${group.patient_id}`}</AccordionTrigger>
                <AccordionContent>
                  {group.reposos.map((reposo) => (
                    <div key={reposo.id} className="mb-4 rounded-lg bg-sky-100 p-3 shadow-lg">
                      <p className="mb-3">
                        <strong>Descripción:</strong> {reposo.description}
                      </p>
                      <Link
                        href={reposo.recipe_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold hover:text-primary hover:underline"
                      >
                        Ver Reposo
                      </Link>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      )}
    </section>
  );
}
