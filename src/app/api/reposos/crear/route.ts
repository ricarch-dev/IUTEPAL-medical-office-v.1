import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const { patient_id, issue_recipe, pdf_url, description } = await req.json();

  try {
    // Descargar el archivo PDF desde la URL
    const response = await axios.get(pdf_url, { responseType: 'arraybuffer' });
    const fileBuffer = response.data;

    // Generar un nombre de archivo único
    const randomNum = Math.floor(Math.random() * 1000000);
    const fileName = `reposo_${patient_id}_${randomNum}.pdf`;

    // Subir el archivo a Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('reposos')
      .upload(`recipes/${fileName}`, fileBuffer, {
        contentType: 'application/pdf',
      });

    if (storageError) {
      console.log('Error uploading file:', storageError.message);
      return NextResponse.json({ error: storageError.message }, { status: 500 });
    }

    // Obtener la URL del archivo
    const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/reposos/${storageData.path}`;

    // Guardar la URL en la base de datos
    const { data, error } = await supabase
      .from('recipe')
      .insert([{ recipe_url: fileUrl, patient_id, issue_recipe, description }])
      .select();

    if (error) {
      console.log('Error en POST:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.log('Error downloading or uploading PDF:', error);
    return NextResponse.json({ error: 'Error downloading or uploading PDF' }, { status: 500 });
  }
}
