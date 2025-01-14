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