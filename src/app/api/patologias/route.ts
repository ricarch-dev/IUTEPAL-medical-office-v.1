import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const systemId = req.nextUrl.searchParams.get('system_id');

  let query = supabase.from('pathologies').select('*');
  if (systemId) {
    query = query.eq('pathology_system_id', systemId);
  }

  const { data, error } = await query;

  if (error) {
    console.log('Error al obtener patologías:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const { name, pathology_system_id } = await req.json();

  if (!name || !pathology_system_id) {
    return NextResponse.json(
      { error: 'El nombre de la patología y el ID del sistema de patologías son obligatorios.' },
      { status: 400 }
    );
  }

  // Convertir el nombre a minúsculas
  const normalizedName = name.toLowerCase();

  // Verificar si ya existe una patología con el mismo nombre en minúsculas
  const { data: existingPathology, error: existingError } = await supabase
    .from('pathologies')
    .select('*')
    .eq('name', normalizedName)
    .single();

  if (existingError && existingError.code !== 'PGRST116') {
    console.log('Error al verificar la existencia de la patología:', existingError.message);
    return NextResponse.json({ error: existingError.message }, { status: 400 });
  }

  if (existingPathology) {
    return NextResponse.json({ error: 'La patología ya existe.' }, { status: 400 });
  }

  // Insertar la nueva patología
  const { data, error } = await supabase.from('pathologies').insert([{ name: normalizedName, pathology_system_id }]);

  if (error) {
    console.log('Error al crear la patología:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}
export async function DELETE(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const { id: pathologyId } = await req.json();

  if (!pathologyId) {
    return NextResponse.json({ error: 'El ID de la patología es obligatorio.' }, { status: 400 });
  }

  const { data, error } = await supabase.from('pathologies').delete().eq('id', pathologyId);

  if (error) {
    console.log('Error al eliminar la patología:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}
