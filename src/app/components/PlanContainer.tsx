'use client';

import React, {useState} from 'react';
import { DndContext, DragEndEvent, useDroppable } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import PlanItem from './PlanItem';

type Data = {
    id: string,
    title: string,
    todos: {
        id: string,
        title: string
    }[]
}

export default function PlanContainer () {
    const [data, setData] = useState<Data>({
        id: 'list-sample',
        title: 'List Sample',
        todos: [
            {id: 'todo1', title: 'todo 1'},
            {id: 'todo2', title: 'todo 2'},
            {id: 'todo3', title: 'todo 3'},
        ],
    });

    function handleDragEnd (event : DragEndEvent) {
        const { active, over } = event;
        if (!over) return;
        if (active.id === over.id) return;
        
        const activeSortable = active.data.current?.sortable;
        const newSortable = over.data.current?.sortable;
        if (!activeSortable || !newSortable) return;

        setData ({
            ...data,
            todos: arrayMove( data.todos, activeSortable.index, newSortable.index ),
        });
    }

    return (
        <DndContext onDragEnd={handleDragEnd} id={data.id}>
            <SortableContext items={data.todos}>
                <div>
                    {data.todos.map((todo) => (
                        <PlanItem key={todo.id} id={todo.id} title={todo.title} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}