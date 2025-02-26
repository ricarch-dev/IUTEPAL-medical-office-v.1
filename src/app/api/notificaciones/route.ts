import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const { data: notifications, error } = await supabase.from('notification').select(`
    id,
    id_event,
    is_read,
    created_at,
    event (
      title,
      description
    )
  `);

  if (error) {
    console.log('Error en GET:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ notifications });
}

export async function PUT(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const { id, is_read, markAll } = await req.json();

  if (markAll) {
    const { data, error } = await supabase.from('notification').update({ is_read: true }).neq('is_read', true);

    if (error) {
      console.log('Error en PUT:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } else {
    const { data, error } = await supabase.from('notification').update({ is_read }).eq('id', id);

    if (error) {
      console.log('Error en PUT:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  }
}
