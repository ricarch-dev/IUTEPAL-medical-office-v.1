import * as React from 'react';
import { ErrorModal } from './send-error-modal';
import { SuccessModal } from './send-success-modal';
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
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Patients } from '../types/patient';
import { cn } from '../lib/utils';

interface Event {
  id?: string;
  id_patient?: string;
  title: string;
  date_time: Date;
  time: string;
  description?: string;
}

interface EditEventModalProps {
  event: Event;
  onClose: () => void;
  onSave: (event: Event) => void;
  children: React.ReactNode;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({ children, event, onClose, onSave }) => {
  const [newEventTitle, setNewEventTitle] = React.useState(event.title);
  const [newEventTime, setNewEventTime] = React.useState(event.time);
  const [newEventDescription, setNewEventDescription] = React.useState(event.description || '');
  const [isError, setIsError] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [patients, setPatients] = React.useState<Patients[]>([]);
  const [selectedPatient, setSelectedPatient] = React.useState<string | undefined>(event.id_patient);

  React.useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('/api/pacientes');
        const data = await res.json();
        setPatients(data.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  const handleSave = () => {
    const updatedEvent = { 
      ...event, 
      title: newEventTitle, 
      time: newEventTime, 
      description: newEventDescription,
      id_patient: selectedPatient 
    };
    onSave(updatedEvent);
    setIsSuccess(true);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Evento</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <Label htmlFor="new-event">Titulo del evento</Label>
          <Input id="new-event" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} />
        </div>
        <div className="w-full">
          <Label htmlFor="new-event-time">Hora</Label>
          <Input
            type="time"
            id="new-event-time"
            value={newEventTime}
            onChange={(e) => setNewEventTime(e.target.value)}
          />
        </div>
        <div className="w-full">
          <Label htmlFor="new-event-description">Descripción</Label>
          <Input
            id="new-event-description"
            value={newEventDescription}
            onChange={(e) => setNewEventDescription(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col mt-1 space-y-1">
          <Label htmlFor="new-event-description">Paciente</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="justify-between"
                aria-expanded={open}
              >
                {selectedPatient
                  ? patients.find((patient) => patient.id.toString() === selectedPatient)?.firts_name + ' ' + patients.find((patient) => patient.id.toString() === selectedPatient)?.last_name
                  : "Seleccione un paciente..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Buscar..." />
                <CommandList>
                  <CommandEmpty>No se encontró ningún paciente registrado.</CommandEmpty>
                  <CommandGroup>
                    {patients.map((patient) => (
                      <CommandItem
                        key={patient.id}
                        value={patient.id.toString()}
                        onSelect={(currentValue) => {
                          setSelectedPatient(currentValue === selectedPatient ? undefined : currentValue);
                          setOpen(false);
                        }}
                      >
                        {patient.firts_name} {patient.last_name}
                        <Check
                          className={cn(
                            "ml-auto",
                            patient.id.toString() === selectedPatient ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button variant="default" onClick={handleSave}>
            Actualizar evento
          </Button>
        </DialogFooter>
      </DialogContent>
      <ErrorModal
        messageBody={'Hubo un error al actualizar el evento.'}
        title="Error al enviar la solicitud"
        isError={isError}
        setIsError={setIsError}
      />
      <SuccessModal
        title="Exito!"
        messageBody="Evento actualizado exitosamente!"
        isSuccess={isSuccess}
        setIsSuccess={setIsSuccess}
      />
    </Dialog>
  );
};
