import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({
        cookies: () => cookieStore
    });

    try {
        const { email } = await req.json();

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${req.nextUrl.origin}/restablecer-contrasena`,
        });

        if (error) {
            console.error('Error recovery in:', error.message);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}