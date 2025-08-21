/** @format */

'use client';

import React, { useState, useRef } from 'react';
import {
  DndContext,
  DragEndEvent,
  Active,
  Over,
  CollisionDetection,
  closestCorners,
  UniqueIdentifier,
  DragStartEvent,
  DragOverEvent,
  useSensor,
  useSensors,
  MouseSensor,
  closestCenter
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import PlanItem from './PlanItem';
import AddTodo from '../components/AddTodo';
import Droppable from '../components/Droppable';
import TimeSlot from './TimeSlot';
import AddContainerButton from './AddContainerButton';
import DeleteContainerButton from './DeleteContainerButton';
import { FiSave } from 'react-icons/fi';
import { MdOutlineCancel } from 'react-icons/md';
import { Database } from '@/types/database.types';

type Plan = Database['public']['Tables']['plans']['Row'];

export type todosData = {
  id: string;
  name: string;
  lists: {
    id: string;
    title: string;
    todos: {
      [time: string]: {
        id: string;
        title: string;
      };
    };
  }[];
};

type PlanContainerProps = {
  planData: Plan;
  pageId: string;
};

export default function PlanContainer({ planData, pageId }: PlanContainerProps) {
  const [data, setData] = useState<todosData>(
    (planData.todos as todosData) ?? {
      id: '',
      name: '',
      lists: [],
    }
  );
  const [id, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [editedItemId, setEditedItemId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 5 } }));

  const timeSlots = ['08:00', '09:00', '10:00', '11:00'];

  // サーバー保存関数
  const saveToServer = (latestData: todosData) => {
    fetch(`http://localhost:3002/plans/${pageId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: pageId, todos: latestData }),
    });
  };


  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    if (!active) return;
    setActiveId(active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const sortedData = getSortedData(event);

    if (!sortedData) return;

    const { from, to } = sortedData;
    if (from.containerId === to.containerId) {
      const list = data!.lists.find((list) => list.id == from.containerId);
      if (!list) return;

      const newTodos = arrayMove(list.todos, from.index, to.index);
      const newLists = data.lists.map((list) => {
        if (list.id === from.containerId) return { ...list, todos: newTodos };
        return list;
      });

      const newData = { ...data, lists: newLists };
      setData(newData);

      // サーバー登録
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => saveToServer(newData), 10000);
    } else {
      // 並び替えが発生しなかった場合もサーバー登録したい場合
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => saveToServer(data), 10000);
    }
  }

  const customClosestCorners: CollisionDetection = (args) => {
    const cornerCollisions = closestCorners(args);

    // 一番近いリストのコンテナを取得
    const listIds = new Set(data.lists.map((list) => list.id));
    const closestContainer = cornerCollisions.find((c) => {
      return listIds.has(c.id.toString());
    });

    if (!closestContainer) return cornerCollisions;

    // closestContainerの中のチケットのみを取得
    const collisions = cornerCollisions.filter(({ data }) => {
      if (!data) return false;
      const droppableData = data.droppableContainer?.data?.current;
      if (!droppableData) return false;
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

  const [todoText, setTodoText] = useState('');

  function onChangeTodoText(e: React.ChangeEvent<HTMLInputElement>) {
    setTodoText(e.target.value);
  }

  function onClickAdd() {
    if (todoText === '') return;

    const copiedTodoData = { ...data };

    const newTodo = {
      id: todoText,
      title: todoText,
    };

    // TODO: 'list1'と静的に記載しているのがよくないので修正したい
    const firstList = copiedTodoData.lists.find((list) => list.id === 'list1');

    if (!firstList) return;

    copiedTodoData.lists.map((list, index) => {
      if (index === 0) {
        list.todos.push(newTodo);
      }
    });

    setData(copiedTodoData);

    setTodoText('');
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const todos = data;

    saveToServer(todos);
  };

  function onClickDelete(id: string) {
    const copiedTodoData = { ...data };
    let filteredData = [];
    copiedTodoData.lists.map((list) => {
      filteredData = list.todos.filter((todo) => {
        return todo.id !== id;
      });
      list.todos = filteredData;
    });

    // 状態更新を次のレンダリングサイクルに遅延させる
    requestAnimationFrame(() => {
      setData(copiedTodoData);
    });
  }

  function onClickEdit(id: string) {
    const copiedTodoData = { ...data };
    copiedTodoData.lists.map((list) => {
      list.todos.map((todo) => {
        if (todo.id === id) {
          todo.title = editedText ? editedText : todo.title;

          // 状態更新を次のレンダリングサイクルに遅延させる
          requestAnimationFrame(() => {
            setEditedItemId(null);
            setData(copiedTodoData);
          });
        }
      });
    });
  }

  function onClickEditCancel() {
    setEditedItemId(null);
  }

  function onClickAddContainer() {
    const newListId = `list-${Date.now()}`;
    const newList = {
      id: newListId,
      title: `List ${data.lists.length + 1}`,
      todos: [],
    };

    const newData = {
      ...data,
      lists: [...data.lists, newList],
    };

    setData(newData);
    saveToServer(newData);
  }

  function onClickDeleteContainer() {
    const shouldDelete = window.confirm(
      '最終日のコンテナが消えてしまいますがよろしいですか？n（todoがある場合、一緒に削除されます。ntodoを消したくない場合は、最終日より前のコンテナに移してください）'
    );

    if (!shouldDelete) return;

    const copiedData = { ...data };
    copiedData.lists.pop();

    setData(copiedData);
    saveToServer(copiedData);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='flex items-center justify-between'>
          <AddTodo todoText={todoText} onChangeTodoText={onChangeTodoText} onClickAdd={onClickAdd} />
          <div className='flex items-center justify-between'>
            <AddContainerButton onAddList={onClickAddContainer} />
            <DeleteContainerButton onDeleteList={onClickDeleteContainer} />
          </div>
        </div>
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          id={data.id}
          collisionDetection={closestCenter}
          sensors={sensors}
        >
          <div className='grid grid-cols-3 gap-4 mt-4'>
            {data.lists &&
              data.lists.map((list, index) => (
                  <Droppable key={list.id} id={list.id}>
                    <div className='text-lg font-bold text-center'>Day {index + 1}</div>
                    {timeSlots.map((time) => {
                        const todo = list.todos[time];
                        const slotId = `${list.id}-${time}`;

                        return (
                          // ここにDroppableなコンポーネント(TimeSlot)を置きます
                          <TimeSlot key={slotId} id={slotId} listId={list.id} time={time}>
                            <span className="time-label">{time}</span>
                            {/* もし、その時間にTODOが存在すれば、DraggableなTODOコンポーネントを描画します */}
                            {todo ? 
                            <>
                              {editedItemId === todo.id ? (
                                <div className='w-full inline-flex items-center gap-x-3 py-2 px-4 cursor-grab text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg'>
                                  <input
                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                    type='text'
                                    key={todo.id}
                                    placeholder={todo.title}
                                    value={editedText}
                                    onChange={(e) => setEditedText(e.target.value)}
                                  />
                                  <button onClick={() => onClickEdit(todo.id)}>
                                    <FiSave />
                                  </button>
                                  <button onClick={onClickEditCancel}>
                                    <MdOutlineCancel />
                                  </button>
                                </div>
                              ) : (
                                <PlanItem key={todo.id}
                                    id={todo.id}
                                    title={todo.title}
                                    timeSlotId={slotId}
                                    onClickDelete={() => onClickDelete(todo.id)}
                                    onClickEdit={() => setEditedItemId(todo.id)}
                                  />
                              )}
                            </>
                            : null}
                          </TimeSlot>
                        );
                    })}
                  </Droppable>
              ))}
          </div>
        </DndContext>
      </form>
    </>
  );
}
