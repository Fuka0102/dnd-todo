'use client';

import React, {useState} from 'react';
import { DndContext, DragEndEvent, Active, Over, CollisionDetection, closestCorners, UniqueIdentifier, DragStartEvent, DragOverEvent, useSensor, useSensors, MouseSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import PlanItem from './PlanItem';
import AddTodo from '../components/AddTodo';
import Droppable from '../components/Droppable';
import { FiSave } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";

export type Data = {
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

export default function PlanContainer ({planData}) {
    const [data, setData] = useState<Data>(planData.todos);
    const [id, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [editedItemId, setEditedItemId] = useState<string | null>(null);
    const [editedText, setEditedText] = useState("");

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } })
    )

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

    function handleDragOver(event: DragOverEvent){
        const sortedData = getSortedData(event);

        if(!sortedData) return;

        const {from, to} = sortedData;

        if(from.containerId === to.containerId) return;

        const fromList = data.lists.find(list => list.id == from.containerId);
        const toList = data.lists.find(list => list.id == to.containerId);
        if(!fromList || !toList) return;

        const moveTodo = fromList.todos.find(todo => todo.id === from.items[from.index]);
        if(!moveTodo) return;

        const newFromTodo = fromList.todos.filter((todo) => todo.id !== moveTodo.id);
        
        const newToTodo = [...toList.todos.slice(0, to.index), moveTodo, ...toList.todos.slice(to.index)];

        const newLists = data.lists.map(list => {
            if(list.id === from.containerId) return {...list, todos: newFromTodo};
            if(list.id === to.containerId) return {...list, todos: newToTodo};

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

    const [todoText, setTodoText] = useState(""); 

    function onChangeTodoText (e: React.ChangeEvent<HTMLInputElement>) {
        setTodoText(e.target.value);
    }

    function onClickAdd () {
        if (todoText === "") return;

        const copiedTodoData = { ...data };
        
        const newTodo = {
            id: todoText,
            title: todoText,
        }

        // TODO: 'list1'と静的に記載しているのがよくないので修正したい
        const firstList = copiedTodoData.lists.find(list => list.id === 'list1');

        if(!firstList) return;

        copiedTodoData.lists.map((list, index) => {
            if (index === 0) {
                list.todos.push(newTodo)
            }
        });

        setData(copiedTodoData);

        setTodoText("");
    }

    function onClickDelete (id: string) {
        const copiedTodoData = { ...data };
        let filteredData = [];
        
        copiedTodoData.lists.map((list) => {
            filteredData = list.todos.filter((todo) => {
                return todo.id !== id;
            })

            list.todos = filteredData;
        });

        setData(copiedTodoData);
    }

    function onClickEdit (id: string) {
        const copiedTodoData = { ...data };
        
        copiedTodoData.lists.map((list) => {
            list.todos.map((todo) => {
                if (todo.id === id) {
                    todo.title = editedText ? editedText : todo.title;
                    setEditedItemId(null);
                }
            })
        });

        setData(copiedTodoData);
    }

    function onClickEditCancel () {
        setEditedItemId(null);
    }

    return (
        <>
            <AddTodo todoText={todoText} onChangeTodoText={onChangeTodoText} onClickAdd={onClickAdd} />
            <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} id={data.id} collisionDetection={customClosestCorners} sensors={sensors}>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {data.lists && data.lists.map((list) => (
                            <SortableContext id={list.id} items={list.todos} key={list.id}>
                            <Droppable key={list.id}  id={list.id}>
                                <div className="border min-h-80">
                                    {list.todos.map((todo) => (
                                        <div key={todo.id}>
                                            {editedItemId === todo.id ? (
                                                <div className="w-full inline-flex items-center gap-x-3 py-2 px-4 cursor-grab text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
                                                    <input
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        type="text"
                                                        key={todo.id}
                                                        placeholder={todo.title}
                                                        value={editedText}
                                                        onChange={(e) => setEditedText(e.target.value)}
                                                    />
                                                    <button onClick={() => onClickEdit(todo.id)}><FiSave /></button>
                                                    <button onClick={onClickEditCancel}><MdOutlineCancel /></button>
                                                </div>
                                            ) : (
                                                <PlanItem key={todo.id} id={todo.id} title={todo.title} onClickDelete={()=> onClickDelete(todo.id)} onClickEdit={() => setEditedItemId(todo.id)} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Droppable>
                        </SortableContext>
                ))}
                </div>
            </DndContext>
        </>
    )
}