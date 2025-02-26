'use client';

import { z } from 'zod';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '../hooks/use-toast';
import { useEffect, useState } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DatePicker } from './date-picker';

interface PatientsCreateModalProps {
  children: React.ReactNode;
  id?: string;
  title: string;
  sub: string;
  onRefresh: () => void;
}

const FormSchema = z.object({
  id: z.string().regex(/^\d+$/, { message: 'La cédula no debe contener letras.' }).optional(),
  firts_name: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, { message: 'El nombre no debe contener números.' })
    .optional(),
  second_name: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, { message: 'El segundo nombre no debe contener números.' })
    .optional(),
  last_name: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, { message: 'El apellido paterno no debe contener números.' })
    .optional(),
  second_last_name: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, { message: 'El apellido materno no debe contener números.' })
    .optional(),
  dob: z
    .date({
      required_error: 'La fecha de Nacimiento es requerida.',
    })
    .optional(),
  charge: z.string().optional(),
  direction: z.string().optional(),
  phone: z
    .string()
    .regex(/^\+58\d+$/, { message: 'El teléfono celular debe comenzar con +58 y no debe contener caracteres.' })
    .optional(),
  email: z.string().optional(),
  sex: z.string().optional(),
  age: z.string().regex(/^\d+$/, { message: 'La edad no debe contener letras o caracteres.' }).optional(),
});

export function PatientsCreateModal({ children, id, title, sub, onRefresh }: PatientsCreateModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone: '+58', // Valor por defecto para el teléfono celular
      dob: new Date(), // Valor por defecto para la fecha de nacimiento
    },
  });

  useEffect(() => {
    if (id) {
      const fetchPatient = async () => {
        const response = await fetch(`/api/pacientes?id=${id}`);
        const result = await response.json();
        const patient = result.data[0];
        form.reset({
          id: patient.id.toString() || '',
          firts_name: patient.firts_name,
          second_name: patient.second_name || '',
          last_name: patient.last_name,
          second_last_name: patient.second_last_name || '',
          dob: new Date(patient.dob),
          charge: patient.charge,
          direction: patient.direction,
          phone: patient.phone || '+58',
          email: patient.email,
          sex: patient.sex,
          age: patient.age.toString(),
        });
      };
      fetchPatient();
    }
  }, [id, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);

    try {
      const payload = {
        ...data,
        id: data.id ? parseInt(data.id, 10) : undefined,
        age: data.age ? parseInt(data.age, 10) : undefined,
        dob: data.dob ? new Date(data.dob) : undefined,
      };

      const response = await fetch(id ? `/api/pacientes` : '/api/pacientes', {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cedula: id, ...payload }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error,
        });
        return;
      }

      const result = await response.json();
      console.log(result);
      toast({
        title: 'Éxito',
        description: 'Paciente guardado correctamente.',
      });
      onRefresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:h-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>
            Asegúrese de ingresar todos los datos necesarios para la {sub} paciente.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <span className="loader m-auto"></span>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cédula</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="firts_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primer Nombre</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="second_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Segundo Nombre</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido Paterno</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="second_last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido Materno</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="charge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar Cargo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Estudiante">Estudiante</SelectItem>
                          <SelectItem value="Administracion">Administración</SelectItem>
                          <SelectItem value="Docente">Docente</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="direction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección Corta</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono Celular</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Nacimiento</FormLabel>
                      <DatePicker onChange={field.onChange} value={field.value} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Femenino">Femenino</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Edad</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
