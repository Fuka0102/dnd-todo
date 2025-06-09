import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
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

export async function POST(req: Request) {
    const supabase = await createClient()
    const { id, todos } = await req.json();

    const { data, error } = await supabase
        .from('plans')
        .update([{ todos }])
        .eq('id', id);
    
    if (error) {
        return NextResponse.json(error);
    }

    return NextResponse.json(data);
}