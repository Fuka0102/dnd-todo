'use client';

import React, {useState} from 'react';
import { DndContext, DragEndEvent, useDroppable, Active, Over } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import PlanItem from './PlanItem';

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

export default function PlanContainer () {
    const [data, setData] = useState<Data>({
        id: 'PJ1',
        name: 'Project 1',
        lists: [
            {
            id: 'list-sample',
            title: 'List Sample',
            todos: [
                {id: 'todo1', title: 'todo 1'},
                {id: 'todo2', title: 'todo 2'},
                {id: 'todo3', title: 'todo 3'},
            ],
        },
        {
            id: 'list-sample2',
            title: 'List Sample2',
            todos: [
                {id: 'todo4', title: 'todo 4'},
                {id: 'todo5', title: 'todo 5'},
                {id: 'todo6', title: 'todo 6'},
            ],
        },
        {
            id: 'list-sample3',
            title: 'List Sample3',
            todos: [
                {id: 'todo7', title: 'todo 7'},
                {id: 'todo8', title: 'todo 8'},
            ],
        }]
    });
    const [id, setActiveId] = useState(null);

    function getSortedData(event: { active: Active; over: Over | null }) {
        const { active, over } = event;
        if (!over) return;
        if (active.id === over.id) return;

        const fromSortable = active.data.current?.sortable;
        if (!fromSortable) return;

        const toSortable = over.data.current?.sortable;
        const notToSortable = {
            containerId: over.id,
            index: NaN,
            items: NaN,
        }

        return {
            from: fromSortable,
            to: toSortable ?? notToSortable,
        };
    }

    function handleDragEnd(event: DragEndEvent) {
        setActiveId(null);
        const sortedData = getSortedData(event);
        if(!sortedData) return;

        const {from, to} = sortedData;
        if(from.containerId !== to.containerId) return;

        const list = data.lists.find(list => list.id == from.containerId);
        if(!list) return;

        const newTodos = arrayMove(list.todos, from.index, to.index);
        const newLists = data.lists.map(list => {
            if(list.id === from.containerId) return {...list, todos: newTodos};
            return list;
        });

        setData({...data, lists: newLists});
    }

    return (
        <DndContext onDragEnd={handleDragEnd} id={data.id}>
            {data.lists.map((list) => (
                <SortableContext key={list.id} id={list.id} items={list.todos}>
                    <div>
                        {list.todos.map((todo) => (
                            <PlanItem key={todo.id} id={todo.id} title={todo.title} />
                        ))}
                    </div>
                </SortableContext>
            ))}
        </DndContext>
    )
}