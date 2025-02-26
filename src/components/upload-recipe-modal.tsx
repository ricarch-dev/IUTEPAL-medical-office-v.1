'use client';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn, formattedDate } from '../lib/utils';
import { Button } from '@/src/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Input } from '@/src/components/ui/input';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { Patients } from '../types/patient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '../hooks/use-toast';

interface UploadRecipeModalProps {
  children: React.ReactNode;
  onRecipeImported: () => void; // Callback para actualizar la vista
}

const FormSchema = z.object({
  recipe_url: z.instanceof(File),
  patient_id: z.number(),
});

export const UploadRecipeModal = ({ children, onRecipeImported }: UploadRecipeModalProps) => {
  const [patients, setPatients] = useState<Patients[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', data.recipe_url);
    formData.append('patient_id', data.patient_id.toString());
    formData.append('description', `Subido desde la vista de reposos ${formattedDate}`);

    try {
      const res = await fetch('/api/reposos', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        toast({
          title: 'Reposo importado',
        });
        onRecipeImported(); // Llama al callback
        setIsOpen(false);
      } else {
        const json = await res.json();
        toast(json.error);
      }
    } catch (error) {
      console.error('Error importing recipe:', error);
      toast({
        title: 'Error al importar el reposo',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-xl">
        <DialogHeader>
          <DialogTitle>Importar</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="recipe_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reposo</FormLabel>
                  <FormControl>
                    <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0])} />
                  </FormControl>
                  <FormDescription>Importe el reposo del paciente</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="patient_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Paciente</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn('justify-between', !field.value && 'text-muted-foreground')}
                        >
                          {field.value
                            ? patients.find((patient) => Number(patient.id) === field.value)?.firts_name
                            : 'Seleccione un paciente...'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Buscar..." />
                        <CommandList>
                          <CommandEmpty>No se encontro ningun paciente registrado.</CommandEmpty>
                          <CommandGroup>
                            {patients.map((patient) => (
                              <CommandItem
                                value={patient.firts_name}
                                key={patient.id}
                                onSelect={() => {
                                  form.setValue('patient_id', Number(patient.id));
                                }}
                              >
                                {patient.firts_name}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    Number(patient.id) === field.value ? 'opacity-100' : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Seleccione un paciente para importar el reposo.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Cargando...' : 'Importar reposo'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
