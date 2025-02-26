'use client';
import { Skeleton } from '@/src/components/ui/skeleton';
import { ProfileUpdateModal } from '@/src/components/modal-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { User } from '@/src/types/user';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const response = await fetch('/api/usuario');
    const data = await response.json();
    setUser(data.user);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser(); // Llamada a fetchUser cuando el componente se monta
  }, []);

  return (
    <div>
      <div className="my-5 flex">
        {loading ? (
          <Skeleton className="size-60 rounded-full bg-sky-100" />
        ) : (
          <Avatar className="size-60">
            <AvatarImage src={user?.avatar_url} alt="Avatar" />
            <AvatarFallback className="text-5xl">
              {(user?.name?.slice(0, 1) || 'U') + (user?.apellido_p?.slice(0, 1) || 'U')}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="m-4">
          <h2 className="text-3xl">
            {loading ? (
              <Skeleton className="h-[30px] w-[200px] rounded-full bg-sky-100" />
            ) : (
              user?.username || 'NOMBRE DE USUARIO'
            )}
          </h2>
          <h3>{loading ? <Skeleton className="mt-3 h-[20px] w-[250px] rounded-full bg-sky-100" /> : user?.email}</h3>
        </div>
      </div>
      <h2>{loading ? <Skeleton className="h-[30px] w-[200px] bg-sky-100" /> : 'Datos personales'}</h2>
      <div className="my-5 grid grid-cols-3 gap-4 space-y-4">
        <div className="mt-3 grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name">
            {loading ? <Skeleton className="h-[20px] w-[150px] rounded-full bg-sky-100" /> : 'Nombre(s)'}
          </Label>
          <ProfileUpdateModal title="Editar Nombre" isName onUpdate={fetchUser}>
            <div className="relative">
              {loading ? (
                <Skeleton className="h-[40px] w-full rounded-full bg-sky-100" />
              ) : (
                <>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Nombre"
                    readOnly
                    value={user?.name || ''}
                    className="pl-10"
                  />
                  <Pencil className="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400" />
                </>
              )}
            </div>
          </ProfileUpdateModal>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="apellido_p">
            {loading ? <Skeleton className="h-[20px] w-[150px] rounded-full bg-sky-100" /> : 'Apellido Paterno'}
          </Label>
          <ProfileUpdateModal title="Editar Apellido Paterno" isApellidoPaterno onUpdate={fetchUser}>
            <div className="relative">
              {loading ? (
                <Skeleton className="h-[40px] w-full rounded-full bg-sky-100" />
              ) : (
                <>
                  <Input
                    type="text"
                    id="apellido_p"
                    placeholder="Apellido Paterno"
                    readOnly
                    value={user?.apellido_p || ''}
                    className="pl-10"
                  />
                  <Pencil className="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400" />
                </>
              )}
            </div>
          </ProfileUpdateModal>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="apellido_m">
            {loading ? <Skeleton className="h-[20px] w-[150px] rounded-full bg-sky-100" /> : 'Apellido Materno'}
          </Label>
          <ProfileUpdateModal title="Editar Apellido Materno" isApellidoMaterno onUpdate={fetchUser}>
            <div className="relative">
              {loading ? (
                <Skeleton className="h-[40px] w-full rounded-full bg-sky-100" />
              ) : (
                <>
                  <Input
                    type="text"
                    id="apellido_m"
                    placeholder="Apellido Materno"
                    readOnly
                    value={user?.apellido_m || ''}
                    className="pl-10"
                  />
                  <Pencil className="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400" />
                </>
              )}
            </div>
          </ProfileUpdateModal>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="user_id">
            {loading ? <Skeleton className="h-[20px] w-[150px] rounded-full bg-sky-100" /> : 'Nombre de Usuario'}
          </Label>
          <ProfileUpdateModal title="Editar Username" isUsername onUpdate={fetchUser}>
            <div className="relative">
              {loading ? (
                <Skeleton className="h-[40px] w-full rounded-full bg-sky-100" />
              ) : (
                <>
                  <Input
                    type="text"
                    id="username"
                    placeholder="Username"
                    readOnly
                    value={user?.username || ''}
                    className="pl-10"
                  />
                  <Pencil className="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400" />
                </>
              )}
            </div>
          </ProfileUpdateModal>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">
            {loading ? <Skeleton className="h-[20px] w-[150px] rounded-full bg-sky-100" /> : 'Correo electrónico'}
          </Label>
          {loading ? (
            <Skeleton className="h-[40px] w-full rounded-full bg-sky-100" />
          ) : (
            <Input type="email" id="email" placeholder="Email" disabled value={user?.email || ''} />
          )}
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="phone">
            {loading ? <Skeleton className="h-[20px] w-[150px] rounded-full bg-sky-100" /> : 'Teléfono'}
          </Label>
          <ProfileUpdateModal title="Editar Número Telefónico" isPhone onUpdate={fetchUser}>
            <div className="relative">
              {loading ? (
                <Skeleton className="h-[40px] w-full rounded-full bg-sky-100" />
              ) : (
                <>
                  <Input
                    type="text"
                    id="phone"
                    placeholder="Teléfono"
                    readOnly
                    value={user?.phone || ''}
                    className="pl-10"
                  />
                  <Pencil className="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400" />
                </>
              )}
            </div>
          </ProfileUpdateModal>
        </div>
      </div>
    </div>
  );
}
