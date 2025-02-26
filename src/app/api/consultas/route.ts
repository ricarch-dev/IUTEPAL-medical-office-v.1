import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const id_patient = req.nextUrl.searchParams.get('patient_id');
  const id = req.nextUrl.searchParams.get('id');
  let query = supabase.from('consultation').select(`
      *,
      pathology_id (name),
      pathology_system_id (name)
    `);

  if (id_patient) {
    query = query.eq('patient_id', id_patient);
  }

  if (id) {
    query = query.eq('id', id);
  }

  const { data, error } = await query;

  if (error) {
    console.log('Error en GET:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const { patient_id, ...consultationData } = await req.json();

  const { data, error } = await supabase.from('consultation').insert([{ ...consultationData, patient_id }]);

  if (error) {
    console.log('Error en POST:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function PUT(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const { id, ...consultationData } = await req.json();

  const { data, error } = await supabase.from('consultation').update(consultationData).eq('id', id);

  if (error) {
    console.log('Error en PUT:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}
