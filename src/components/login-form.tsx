'use client';
import Image from 'next/image';
import { useState } from 'react';
import logo from '@/public/image/iutepal-logo.png';
import { Label } from '@/src/components/ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/src/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { useRouter } from 'next/navigation';
import { RefreshCcw, Eye, EyeOff } from 'lucide-react';
import { RecoverPasswordModal } from './recover-password-modal';

const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
});

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setErrorMessage(null);
    const { username, password } = values;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error logging in');
      }

      const data = await response.json();
      console.log('User data:', data);

      router.push('/dashboard');
    } catch (error) {
      console.error('Error in login:', error);
      setErrorMessage('Contraseña o correo electrónico incorrecto, por favor intenta de nuevo');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="fade relative h-screen">
      <div className="flex min-h-full flex-col items-center justify-center md:my-16 lg:my-0 lg:flex-row">
        <div className="my-5 flex w-full items-center justify-center md:my-10 lg:my-0">
          <div className="lg:px-6">
            <Image className="mx-auto w-3/4 md:w-4/5 lg:w-full" alt="Login Image" src={logo} />
          </div>
        </div>
        <div className="relative my-5 flex w-full items-center justify-center px-5 md:my-10 lg:my-0">
          <div className="px:0 flex w-full items-center justify-center md:px-12">
            <div className="w-full px-0 md:px-12">
              <div className="mx-auto mb-7 max-w-lg lg:mb-14">
                <div className="mb-2 flex max-w-lg flex-col">
                  <div className="mb-10">
                    <h1 className="text-3xl font-bold md:text-5xl">Consultorio medico</h1>
                  </div>
                  <div className="mb-0 flex flex-col">
                    <h2 className="text-2xl font-medium text-primary md:text-3xl">Inicio de sesión</h2>
                  </div>
                </div>
                <Label className="text-base font-medium text-muted-foreground">
                  Ingresa tus datos para acceder a la plataforma
                </Label>
              </div>
              <div className="text-gray-light mx-auto mt-5 max-w-lg">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="mt-2">
                          <FormControl>
                            <div className="max-w- relative flex w-full items-center space-x-2">
                              <div className="grid w-full max-w-lg items-center">
                                <FormLabel className="mb-1 text-sm text-black" htmlFor="email">
                                  Correo electrónico
                                </FormLabel>
                                <Input
                                  id="email"
                                  placeholder="nameexample@gmail.com"
                                  type={'text'}
                                  required
                                  className="block w-full rounded-md border-0 bg-white py-1.5 pr-10 text-black shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                                  {...field}
                                />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage>
                            {error && (
                              <span className="text-sm font-bold text-red-500" role="alert">
                                {error.message}
                              </span>
                            )}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="mt-2">
                          <FormControl>
                            <div className="relative flex w-full max-w-lg items-center space-x-2">
                              <div className="grid w-full max-w-lg items-center">
                                <FormLabel className="mb-1 text-sm text-black" htmlFor="password">
                                  Contraseña
                                </FormLabel>
                                <div className="relative">
                                  <Input
                                    id="password"
                                    placeholder="*********"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="block w-full rounded-md border-0 bg-white py-1.5 pr-10 text-black shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                                    {...field}
                                  />
                                  <div
                                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? (
                                      <EyeOff className="h-5 w-5 text-gray-500" />
                                    ) : (
                                      <Eye className="h-5 w-5 text-gray-500" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage>
                            {error && (
                              <span className="text-sm font-medium text-red-500" role="alert">
                                {error.message}
                              </span>
                            )}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                    {errorMessage && <span className="text-sm font-medium text-red-500">{errorMessage}</span>}
                    <div className="flex items-center">
                      <RecoverPasswordModal
                        title="Recuperación de contraseña"
                        messageBody="¿Olvidaste tu contraseña? ¡No te preocupes! Estamos aquí para ayudarte a recuperarla. Te enviaremos un mensaje al correo electrónico que utilizaste al registrarte. "
                      >
                        <Button type="button" variant={'ghost'} className="text-gray-light font-medium">
                          ¿Olvidaste tu contraseña?
                        </Button>
                      </RecoverPasswordModal>
                    </div>
                    <div>
                      <Button
                        className="error:border-red-900 disabled:bg-button-disabled disabled:text-gray-light mt-7 flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-bold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:border-none lg:mt-14"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCcw className="mr-2 size-4 animate-spin" />
                            Cargando...
                          </>
                        ) : (
                          'Iniciar sesión'
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
