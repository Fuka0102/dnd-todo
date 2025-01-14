import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
    const supabase = await createClient();
    const id = req.url?.split("/api/")[1];

    const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return NextResponse.json(error);

    if (!data) {
        notFound();
    }

    return NextResponse.json(data);
}