import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const id_patient = req.nextUrl.searchParams.get('id_patient');
  let query = supabase.from('event').select('*');

  if (id_patient) {
    query = query.eq('id_patient', id_patient);
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

  const { id, ...eventData } = await req.json(); // Excluir el campo id

  const { data: event, error: eventError } = await supabase.from('event').insert([eventData]).select().single();

  if (eventError) {
    console.log('Error en POST:', eventError.message);
    return NextResponse.json({ error: eventError.message }, { status: 400 });
  }

  const { data: notification, error: notificationError } = await supabase.from('notification').insert([{ id_event: event.id }]);

  if (notificationError) {
    console.log('Error en POST:', notificationError.message);
    return NextResponse.json({ error: notificationError.message }, { status: 400 });
  }

  return NextResponse.json({ event, notification });
}

export async function PUT(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const { id, ...eventData } = await req.json();

  const { data, error } = await supabase.from('event').update(eventData).eq('id', id);

  if (error) {
    console.log('Error en PUT:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const { id } = await req.json();

  const { data, error } = await supabase.from('event').delete().eq('id', id);

  if (error) {
    console.log('Error en DELETE:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}