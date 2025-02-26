import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { ErrorModal } from './send-error-modal';
import { SuccessModal } from './send-success-modal';

interface DeletePatientModalProps {
  id: string;
  onRefresh: () => void;
  children: React.ReactNode;
}

export const DeletePatientModal: React.FC<DeletePatientModalProps> = ({ id, onRefresh, children }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleDelete = async () => {
    setIsSuccess(true);
    const response = await fetch('/api/pacientes', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cedula: id }),
    });

    if (response.ok) {
      onRefresh();
      setIsSuccess(true);
    } else {
      console.error('Error deleting patient');
      setIsError(true);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Paciente</DialogTitle>
        </DialogHeader>
        <p>¿Estás seguro de que deseas eliminar este paciente?</p>
        <ErrorModal
          messageBody={'Hubo un error al guardar el paciente.'}
          title="Error al enviar la solicitud"
          isError={isError}
          setIsError={setIsError}
        />
        <SuccessModal
          title="Solicitud enviada con éxito"
          messageBody="Paciente guardado exitosamente!"
          isSuccess={isSuccess}
          setIsSuccess={setIsSuccess}
          href="/"
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
