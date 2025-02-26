import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import { Patients } from '../types/patient';

interface ViewPatientsProps {
  children: React.ReactNode;
  id: string;
}

export const ViewPatients: React.FC<ViewPatientsProps> = ({ children, id }) => {
  const [patient, setPatient] = React.useState<Patients | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/pacientes?id=${id}`);
      const result = await response.json();
      setPatient(result.data[0]);
    }
    fetchData();
  }, [id]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="h-auto max-w-xl">
        <DialogTitle className="mb-4 text-3xl">Datos del paciente</DialogTitle>

        {patient && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <h4 className="text-lg font-semibold text-primary">Cédula</h4>
              <p>{patient.id}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-primary">Nombre Completo</h4>
              <p>
                {patient.firts_name} {patient.second_name} {patient.last_name} {patient.second_last_name}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-primary">Sexo</h4>
              <p>{patient.sex ? 'Masculino' : 'Femenino'}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-primary">Correo Electrónico</h4>
              <p>{patient.email}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-primary">Teléfono</h4>
              <p>{patient.phone}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-primary">Dirección</h4>
              <p>{patient.direction}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-primary">Fecha de Nacimiento</h4>
              <p>{patient.dob}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-primary">Edad</h4>
              <p>{patient.age}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
