'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '../hooks/use-toast';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { User } from '../types/user';

interface ProfileUpdateModalProps {
  children: React.ReactNode;
  title: string;
  isPhone?: boolean;
  isName?: boolean;
  isApellidoPaterno?: boolean;
  isApellidoMaterno?: boolean;
  isUsername?: boolean;
  isImage?: boolean;
  onUpdate: () => void;
}

const FormSchema = z.object({
  phone: z.string().min(10, { message: 'Numero telefonico invalido' }).optional(),
  name: z.string().min(2, { message: 'Nombre inválido' }).optional(),
  apellido_p: z.string().min(2, { message: 'Apellido paterno inválido' }).optional(),
  apellido_m: z.string().min(2, { message: 'Apellido materno inválido' }).optional(),
  username: z.string().min(2, { message: 'Username inválido' }).optional(),
  image_url: z.string().optional(),
});

export const ProfileUpdateModal: React.FC<ProfileUpdateModalProps> = ({
  children,
  title,
  onUpdate,
  isName,
  isPhone,
  isApellidoPaterno,
  isApellidoMaterno,
  isUsername,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('/api/usuario');
      const data = await response.json();
      setUser(data.user);
    };

    fetchUser();
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone: user?.phone,
      name: user?.name,
      apellido_p: user?.apellido_p,
      apellido_m: user?.apellido_m,
      username: user?.username,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsUpdating(true);

    const response = await fetch('/api/usuario', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toast({
        title: 'Actualización exitosa',
        description: 'Los datos han sido actualizados correctamente.',
      });
      onUpdate(); // Refresca los datos del usuario en page.tsx
      setOpen(false); // Cierra el modal
    } else {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la información. Intente nuevamente.',
      });
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Actualiza tus datos si son de total importancia.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {isName && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input defaultValue={user?.name} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {isPhone && (
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numero Telefonico</FormLabel>
                    <FormControl>
                      <Input defaultValue={user?.phone} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {isApellidoPaterno && (
              <FormField
                control={form.control}
                name="apellido_p"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido Paterno</FormLabel>
                    <FormControl>
                      <Input defaultValue={user?.apellido_p} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {isApellidoMaterno && (
              <FormField
                control={form.control}
                name="apellido_m"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido Materno</FormLabel>
                    <FormControl>
                      <Input defaultValue={user?.apellido_m} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {isUsername && (
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input defaultValue={user?.username} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter className="sm:justify-end">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
