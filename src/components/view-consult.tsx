import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import { ConsultData } from '../types/consult-data';
import { formatDateConsult } from '../lib/utils';

interface ViewConsultProps {
  children: React.ReactNode;
  id: string;
}

export const ViewConsult: React.FC<ViewConsultProps> = ({ children, id }) => {
  const [consult, setConsult] = React.useState<ConsultData | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/consultas?id=${id}`);
        const result = await response.json();
        if (result.data && result.data.length > 0) {
          setConsult(result.data[0]);
        } else {
          console.error('No data found for the given ID');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [id]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="h-auto max-w-xl">
        <DialogTitle className="mb-4 text-3xl">Datos de la Consulta</DialogTitle>

        {consult && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="font-bold">Fecha de Consulta</div>
              <div>{formatDateConsult(consult.created_at)}</div>
            </div>
            <div>
              <div className="font-bold">Motivo de Consulta</div>
              <div>{consult.reason_consultation}</div>
            </div>
            <div>
              <div className="font-bold">Diagnostico</div>
              <div>{consult.diagnosis}</div>
            </div>
            <div>
              <div className="font-bold">Peso</div>
              <div>{consult.weight}</div>
            </div>
            <div>
              <div className="font-bold">Altura</div>
              <div>{consult.height}</div>
            </div>
            <div>
              <div className="font-bold">Tipo de Sangre</div>
              <div>{consult.blood_type}</div>
            </div>
            <div>
              <div className="font-bold">Temperatura</div>
              <div>{consult.temperature}</div>
            </div>
            <div>
              <div className="font-bold">Patología</div>
              <div>{consult.pathology_id.name}</div>
            </div>
            <div>
              <div className="font-bold">Sistema Patológico</div>
              <div>{consult.pathology_system_id.name}</div>
            </div>
            <div>
              <div className="font-bold">Historial Médico</div>
              <div>{consult.medical_history ? 'Sí' : 'No'}</div>
            </div>
            <div>
              <div className="font-bold">Fuma</div>
              <div>{consult.smoke ? 'Sí' : 'No'}</div>
            </div>
            <div>
              <div className="font-bold">Bebe</div>
              <div>{consult.drink ? 'Sí' : 'No'}</div>
            </div>
            <div>
              <div className="font-bold">Alergico</div>
              <div>{consult.allergic ? 'Sí' : 'No'}</div>
            </div>
            <div>
              <div className="font-bold">Discapacidad</div>
              <div>{consult.discapacity ? 'Sí' : 'No'}</div>
            </div>
            <div>
              <div className="font-bold">Reposo</div>
              <div>{consult.recipe_url ? 'Sí posee' : 'No posee'}</div>
            </div>
            <div>
              <div className="font-bold">Actualizado</div>
              <div>{formatDateConsult(consult.updated_at)}</div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
