'use client';

import React, {useState} from 'react';
import { DndContext, DragEndEvent, Active, Over, CollisionDetection, closestCorners, UniqueIdentifier, DragStartEvent } from '@dnd-kit/core';
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
    const [id, setActiveId] = useState<UniqueIdentifier | null>(null);

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

    function handleDragStart(event: DragStartEvent) {
        const {active} = event;
        if(!active) return;
        setActiveId(active.id);
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

    const customClosestCorners: CollisionDetection = (args) => {
        const cornerCollisions = closestCorners(args);
        
        // 一番近いリストのコンテナを取得
        const listIds = new Set(data.lists.map(list => list.id));
        const closestContainer = cornerCollisions.find((c) => {
            return listIds.has(c.id.toString())
        });

        if(!closestContainer) return cornerCollisions;
        
        // closestContainerの中のチケットのみを取得
        const collisions = cornerCollisions.filter(({ data }) => {
            if(!data) return false;
            const droppableData = data.droppableContainer?.data?.current;
            if(!droppableData) return false;
            const { containerId } = droppableData.sortable;
            return closestContainer.id === containerId;
        });
        
        // 中身のチケットがない場合は、closestContainerを返す
        if (collisions.length === 0) {
            return [closestContainer];
        }
        // 中身のチケットがある場合は、collisionsを返す
        return collisions;
    };

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} id={data.id} collisionDetection={customClosestCorners}>
            <div className="flex">
                {data.lists.map((list) => (
                    <div className="border" key={list.id}>
                        <SortableContext id={list.id} items={list.todos}>
                            <div>
                                {list.todos.map((todo) => (
                                    <PlanItem key={todo.id} id={todo.id} title={todo.title} />
                                ))}
                            </div>
                        </SortableContext>
                    </div>
                ))}
            </div>
        </DndContext>
    )
}