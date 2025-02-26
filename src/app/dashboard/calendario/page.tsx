'use client';

import * as React from 'react';
import { format, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Check, ChevronsUpDown, Pencil, Plus, Trash } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Calendar } from '@/src/components/ui/calendar';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { EditEventModal } from '@/src/components/edit-event-modal';
import { DeleteEventModal } from '@/src/components/delete-event-modal';
import { toast } from '@/src/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import { cn } from '@/src/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/src/components/ui/command';
import { Patients } from '@/src/types/patient';

interface Event {
  id?: string;
  id_patient?: string;
  title: string;
  date_time: Date;
  time: string;
  description?: string;
}

export default function ExpandedCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [events, setEvents] = React.useState<Event[]>([]);
  const [newEventTitle, setNewEventTitle] = React.useState('');
  const [newEventTime, setNewEventTime] = React.useState('');
  const [newEventDescription, setNewEventDescription] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false)
  const [patients, setPatients] = React.useState<Patients[]>([]);
  const [selectedPatient, setSelectedPatient] = React.useState<string | undefined>(undefined);

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

  const fetchEvents = async () => {
    const response = await fetch('/api/eventos');
    const data = await response.json();
    if (Array.isArray(data)) {
      setEvents(data);
    } else if (data.data && Array.isArray(data.data)) {
      setEvents(data.data);
    } else {
      console.error('Unexpected response format:', data);
    }
  };

  React.useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async () => {
    if (date && newEventTitle.trim() !== '' && newEventTime.trim() !== '' && selectedPatient) {
      setIsLoading(true);
      const newEvent: Omit<Event, 'id'> = {
        title: newEventTitle,
        date_time: date,
        time: newEventTime,
        description: newEventDescription,
        id_patient: selectedPatient,
      };
      const response = await fetch('/api/eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });
      const data = await response.json();
      if (data && data.data && data.data.length > 0) {
        setEvents([...events, data.data[0]]);
      }
      setNewEventTitle('');
      setNewEventTime('');
      setNewEventDescription('');
      setSelectedPatient(undefined);
      setIsLoading(false);
      fetchEvents();
      toast({
        title: 'Éxito',
        description: 'Evento añadido exitosamente',
      });
    }
  };

  const deleteEvent = async (id: string) => {
    setIsLoading(true);
    const response = await fetch(`/api/eventos`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      setEvents(events.filter((event) => event.id !== id));
      fetchEvents();
    } else {
      console.error('Failed to delete event');
    }
    toast({
      title: 'Éxito',
      description: 'Evento eliminado exitosamente',
    });
    setIsLoading(false);
  };

  const editEvent = async (updatedEvent: Event) => {
    setIsLoading(true);
    const response = await fetch(`/api/eventos`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEvent),
    });
    if (response.ok) {
      setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)));
      fetchEvents();
    } else {
      console.error('Failed to edit event');
    }
    setIsLoading(false);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
  };

  const filteredEvents = events.filter(
    (event) => date && new Date(event.date_time).toDateString() === date.toDateString()
  );

  const today = startOfDay(new Date());

  return (
    <div className="grid size-full gap-y-4 p-4">
      <Calendar
        locale={es}
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow"
        modifiersClassNames={{
          hasEvents: 'day_hasEvents',
        }}
        disabled={(date) => isBefore(startOfDay(date), today)}
      />
      <Card className="flex-1 shadow">
        <CardHeader>
          <CardTitle>
            Evento para el {date ? format(date, "dd 'de' MMMM 'del' yyyy", { locale: es }) : 'seleccione fecha'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[250px]">
            {filteredEvents.length > 0 ? (
              <ul className="space-y-2">
                {filteredEvents.map((event) => {
                  const patient = patients.find((p) => p.id === event.id_patient);
                  return (
                    <li key={event.id} className="flex items-center rounded-md bg-secondary p-2">
                      Titulo del evento: <span className="mx-2 font-semibold text-primary">{event.title}</span> -
                      Descripcion: <span className="mx-2 font-semibold text-primary"> {event.description}</span> - Hora
                      estimada de la cita: <span className="mx-2 font-semibold text-primary"> {formatTime(event.time)}</span> -
                      Paciente: <span className="mx-2 font-semibold text-primary">{patient ? patient.firts_name + ' ' + patient.last_name : 'N/A'}</span>
                      <div className="-mt-2 ml-auto flex items-center gap-4">
                        <EditEventModal event={event} onSave={editEvent} onClose={() => { }}>
                          <Button variant={'ghost'} className="mt-2 p-0">
                            <Pencil />
                          </Button>
                        </EditEventModal>
                        <DeleteEventModal id={event.id!} onDelete={deleteEvent}>
                          <Button variant={'ghost'} className="mt-2 p-0">
                            <Trash className="stroke-destructive" />
                          </Button>
                        </DeleteEventModal>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-muted-foreground">No existen eventos creados hasta el momento.</p>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex flex-row items-center gap-2">
          <div className="w-full">
            <Label htmlFor="new-event">Titulo del evento</Label>
            <Input
              id="new-event"
              placeholder="Nuevo evento"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
            />
          </div>
          <div className="w-full">
            <Label htmlFor="new-event-time">Hora</Label>
            <Input
              type="time"
              id="new-event-time"
              placeholder="Hora"
              value={newEventTime}
              onChange={(e) => setNewEventTime(e.target.value)}
            />
          </div>
          <div className="w-full">
            <Label htmlFor="new-event-description">Descripción</Label>
            <Input
              id="new-event-description"
              placeholder="Descripción"
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
                          {patient.firts_name}  {patient.last_name}
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
          <Button
            onClick={addEvent}
            className="mt-6"
            disabled={isLoading || !newEventTitle.trim() || !newEventTime.trim() || !newEventDescription.trim()}
          >
            {isLoading ? (
              'Creando...'
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Añadir
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
