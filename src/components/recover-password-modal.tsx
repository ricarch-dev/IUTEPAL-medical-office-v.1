'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { RefreshCcw } from 'lucide-react';
import { ErrorModal } from './send-error-modal';
import { SuccessModal } from './send-success-modal';

interface RecoverPasswordModalProps {
  title: string;
  children: React.ReactNode;
  messageBody?: string;
  questionBody?: string;
}

const FormSchema = z.object({
  email: z.string().email({ message: 'Correo electrónico inválido' }),
});

export const RecoverPasswordModal: React.FC<RecoverPasswordModalProps> = ({ title, children, messageBody }) => {
  const [open, setOpen] = useState(false);
  const [loading, setIsloading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setIsloading(true);
    const { email } = values;

    try {
      const response = await fetch('/api/auth/recover-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      setIsloading(false);

      if (!response.ok) {
        console.error('Error recovery in:', data.message);
        setIsError(true);
      } else {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error('Error recovery in:', error);
      setIsloading(false);
      setIsError(true);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>
      {open && (
        <DialogContent className="max-h-auto h-auto max-w-[600px] rounded-lg text-black">
          <ErrorModal
            messageBody={
              'Tu solicitud no pudo enviarse correctamente, revisa los cambios obligatorios antes de enviar tu solicitud'
            }
            title="Error al enviar la solicitud"
            isError={isError}
            setIsError={setIsError}
          />
          <SuccessModal
            title="Solicitud enviada con éxito"
            messageBody="¡Tu solicitud ha sido enviada correctamente!, por favor revisa tu correo electrónico"
            isSuccess={isSuccess}
            setIsSuccess={setIsSuccess}
          />
          <DialogHeader>
            <DialogTitle className="mb-1 text-2xl font-bold text-primary">{title}</DialogTitle>
          </DialogHeader>

          <div className="mt-2">
            <p className="font-medium text-foreground">{messageBody}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="my-5 w-full space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-foreground">Ingresa tu correo electrónico</FormLabel>
                    <FormControl>
                      <Input className="font-encode h-12 text-black" placeholder="correoejemplo@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-7">
                <Button
                  disabled={!form.formState.isValid || loading}
                  type="submit"
                  className="mb-3 px-10 font-bold md:mb-0"
                  variant={'default'}
                >
                  {loading ? (
                    <>
                      <RefreshCcw className="mr-2 size-4 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    'Recuperar contraseña'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
};
