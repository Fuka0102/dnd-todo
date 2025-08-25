import { createClient } from '@/utils/supabase/server'
import { NextResponse } from "next/server";

type Data = {
    id: string,
    name: string,
    lists: {
        id: string,
        title: string,
        todos: {
            id: string,
            title: string
        }[]
    }[]
}

export async function GET() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('plans_dummy').select('*');

    if (error) {
        return NextResponse.json(error);
    }

    return Response.json(data);
}

export async function POST(req: Request) {
    const supabase = await createClient()
    const { id, title, period } = await req.json();

    const todos: Data = {
        "id": "PJ1",
        "name": "Project 1",
        "lists": [
        ]
    }

    function createData () {
        const parsedPeriod = parseInt(period);
        {[...Array(parsedPeriod)].map((_value, index) => {
            const dataIndex = index + 1;

            todos.lists.push({
                id: `list${dataIndex}`,
                title: `List ${dataIndex}`,
                todos: [],
            });
        })}
    }

    createData();

    const { data, error } = await supabase
        .from('plans_dummy')
        .insert([{ id, title, period, todos, created_at: new Date().toISOString() }]);

    if (error) {
        return NextResponse.json(error);
    }

    return NextResponse.json(data);
}

export async function DELETE(req: Request) {
    const supabase = await createClient()
    const { id } = await req.json();
    const { data, error } = await supabase.from('plans_dummy').delete().eq('id', id);

    if (error) {
        return NextResponse.json(error);
    }

    return Response.json(data);
}