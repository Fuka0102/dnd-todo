import { createClient } from '@/utils/supabase/server'
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('plans').select('*');

    if (error) {
        return NextResponse.json(error);
    }

    return Response.json(data);
}

export async function POST(req: Request, res: Response) {
    const supabase = await createClient()
    const { id, title, period } = await req.json();

    const { data, error } = await supabase
        .from('plans')
        .insert([{ id, title, period, created_at: new Date().toISOString() }]);

    if (error) {
        return NextResponse.json(error);
    }

    return NextResponse.json(data);
}