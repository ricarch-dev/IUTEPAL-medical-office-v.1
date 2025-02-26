import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const { data, error } = await supabase.from('recipe').select('*');

  if (error) {
    console.log('Error en GET:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const patient_id = formData.get('patient_id') as string;
  const description = formData.get('description') as string;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // Subir el archivo a Supabase Storage
  const { data: storageData, error: storageError } = await supabase.storage
    .from('reposos')
    .upload(`recipes/${file.name}`, file);

  if (storageError) {
    console.log('Error uploading file:', storageError.message);
    return NextResponse.json({ error: storageError.message }, { status: 500 });
  }

  // Obtener la URL del archivo
  const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/reposos/${storageData.path}`;

  // Guardar la URL en la base de datos
  const { data, error } = await supabase
    .from('recipe')
    .insert([{ recipe_url: fileUrl, patient_id, description }])
    .select();

  if (error) {
    console.log('Error en POST:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0]);
}
