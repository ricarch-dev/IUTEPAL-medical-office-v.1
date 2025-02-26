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
import { Textarea } from '@/src/components/ui/textarea';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { Patients } from '../types/patient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '../hooks/use-toast';
import axios from 'axios';

interface CreateRecipeModalProps {
  children: React.ReactNode;
  onRecipeCreated: () => void;
}

const FormSchema = z.object({
  issue_recipe: z.string(),
  patient_id: z.number(),
});

export const CreateRecipeModal = ({ children, onRecipeCreated }: CreateRecipeModalProps) => {
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
    try {
      const randomNum = Math.floor(Math.random() * 1000000); // Genera un número aleatorio
      const patientName = patients.find((patient) => Number(patient.id) === data.patient_id)?.firts_name;
      const outputFileName = `reposo_${patientName}_${randomNum}.pdf`;

      const response = await axios.post(
        'https://api.craftmypdf.com/v1/create',
        {
          template_id: '6e277b23bbd948ce',
          data: {
            issue_recipe: data.issue_recipe,
          },
          output_file: outputFileName,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': '9af0MTU5MzQ6MTYwMTU6dVNGcHJDTDJ0WDJpZW9oVg=',
          },
        }
      );

      const pdfUrl = response.data.file;
      if (pdfUrl) {
        // Envia la URL del PDF a la API para descargar y guardar internamente
        const saveResponse = await fetch('/api/reposos/crear', {
          method: 'POST',
          body: JSON.stringify({
            patient_id: data.patient_id,
            issue_recipe: data.issue_recipe,
            pdf_url: pdfUrl,
            description: `Creado desde la vista de reposos ${formattedDate}`,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (saveResponse.ok) {
          toast({
            title: 'Reposo creado y guardado con éxito',
          });
          onRecipeCreated(); // Llamar al callback para actualizar la vista
          setIsOpen(false); // Cerrar el modal
        } else {
          const saveError = await saveResponse.json();
          toast({
            title: saveError.error,
            variant: 'destructive',
          });
        }
      } else {
        console.error('PDF URL not found in the response');
        toast({
          title: 'No se pudo generar el PDF',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Ocurrio un problema al generar el PDF',
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
          <DialogTitle>Crear reposo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <FormDescription>Puede escoger un paciente para importar el reposo.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="issue_recipe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asunto del reposo</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>
                    Por favor, ingrese el motivo de consulta del paciente para generar el reposo.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Cargando...' : 'Crear reposo'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
