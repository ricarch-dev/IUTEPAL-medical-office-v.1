import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({
        cookies: () => cookieStore
    });

    const { email, password } = await req.json();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
}