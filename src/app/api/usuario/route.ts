import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { User, Users } from 'lucide-react';

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: authError?.message || 'Usuario no autenticado' }, { status: 500 });
  }
  const { data: userProfile, error: profileError } = await supabase
    .from('vista_perfil') 
    .select('*')
    .eq('user_id', user?.id) 
    .single();

  if (profileError || !userProfile) {
    return NextResponse.json({ error: profileError?.message || 'Perfil no encontrado' }, { status: 500 });
  }

  
  return NextResponse.json({ user: userProfile }, { status: 200 });
}
export async function PUT(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: authError?.message || 'Usuario no autenticado' }, { status: 500 });
  }

  // Obtener los datos del cuerpo de la solicitud
  const { name, apellido_p, apellido_m, phone, username, avatar_url } = await req.json();

  // Preparamos un objeto con los campos a actualizar
  const updates: Record<string, string | undefined> = {};
  if (name !== undefined) updates.name = name;
  if (apellido_p !== undefined) updates.apellido_p = apellido_p;
  if (apellido_m !== undefined) updates.apellido_m = apellido_m;
  if (phone !== undefined) updates.phone = phone;
  if (username !== undefined) updates.username = username;
  if (avatar_url !== undefined) updates.avatar_url = avatar_url;

  // Si no hay campos para actualizar, devolvemos un error
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 });
  }

  // Realizar la actualización en la tabla real en lugar de la vista
  const { data, error } = await supabase
    .from('usuarios')  // Actualizamos sobre la tabla 'usuarios' (o la tabla que corresponda)
    .update(updates)  // Actualizamos con los datos proporcionados
    .eq('user_id', user.id);  // Usamos el 'user_id' para actualizar el perfil del usuario

  if (error) {
    console.log('Error en PUT:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}