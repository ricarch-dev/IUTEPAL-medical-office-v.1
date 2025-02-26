import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const currentYear = new Date().getFullYear();
  const { data, error } = await supabase
    .from('recipe')
    .select('*')
    .gte('created_at', `${currentYear}-01-01`)
    .lte('created_at', `${currentYear}-12-31`);

  if (error) {
    console.log('Error en GET:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}
