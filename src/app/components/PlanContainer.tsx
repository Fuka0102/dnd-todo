/** @format */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  DndContext,
  DragEndEvent,
  UniqueIdentifier,
  DragStartEvent,
  useSensor,
  useSensors,
  MouseSensor,
  closestCenter
} from '@dnd-kit/core';
import PlanItem from './PlanItem';
import AddTodo from '../components/AddTodo';
import Droppable from '../components/Droppable';
import TimeSlot from './TimeSlot';
import AddContainerButton from './AddContainerButton';
import DeleteContainerButton from './DeleteContainerButton';
import SaveResult from './SaveResult';
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
  const [isStartToSave, setIsStartToSave] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const isFirstRender = useRef(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 5 } }));

  const timeSlots = ['8:00', '9:00', '10:00', '11:00', '12:00'];

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    saveToServer(data);
  }, [data]);

  // サーバー保存関数
  const saveToServer = (latestData: todosData) => {
    if (!isStartToSave) {
      setIsStartToSave(true);
    }

    fetch(`${API_URL}/api/${pageId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: pageId, todos: latestData }),
    })
      .then(response => {
        setIsStartToSave(false);

        if (!response.ok) {
          console.error('サーバーエラー');
          setIsFailed(true)
          return;
        }

        setIsCompleted(true);
        setTimeout(() => setIsCompleted(false), 3000);
      })
      .catch(error => {
        setIsStartToSave(false);
        console.error('通信に失敗しました', error);
        setIsFailed(true)
        setTimeout(() => setIsFailed(false), 3000);
      });
  };

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    if (!active) return;
    setActiveId(active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    // 1. ドロップできるエリアの外でドロップされた場合は何もしない
    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id; // ドラッグされたTODOのID
    const overId = over.id;     // ドロップされたタイムスロットのID (例: "list1-09:00")

    // 2. plansのstateを更新する
    setData(prevPlans => {

      let draggedTodo = null;
      let sourceList = null; 
      let targetList = null;
      let sourceTime = null;

      // 3. まず、ドラッグされたTODOが「元々どこにいたか」を探し、データを取り出す
      for (const plan of data.lists) {
        for (const time in plan.todos) {
            if (plan.todos[time]?.id === activeId) {
              draggedTodo = plan.todos[time];
              
              // 元の場所を記録しておく
              sourceList = plan;
              sourceTime = time;
              draggedTodo = plan.todos[time];
              break;
            }
        }
        if (sourceList) break;
      }

      // 4. overId (例: "list1-09:00") から、ドロップ先のDay(list)のIDと時間を特定
      const [targetListId, targetTime] = String(overId).split('-');
      targetList = data.lists.find(list => list.id === targetListId);

      if (!draggedTodo || !sourceList || !targetList || !targetTime) {
        console.warn("必要な情報が不足しているため、更新をキャンセルしました。");
        return data; // 何も変更せずに元のデータを返す
      }

      const newPlans = JSON.parse(JSON.stringify(prevPlans.lists));

      // 5. 実際の更新処理
      const finalSourceList = newPlans.find((list: { id: string; }) => list.id === sourceList.id);
      const finalTargetList = newPlans.find((list: { id: string; }) => list.id === targetList.id);

      // 元の場所から削除
      if (sourceTime !== null) {
        delete finalSourceList.todos[sourceTime];
      }

      // 新しい場所に配置 (※もし入れ替えが必要なら、ここのロジックを拡張)
      finalTargetList.todos[targetTime] = draggedTodo;

      return { ...data, lists: newPlans };
    });

  }

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

    copiedTodoData.lists.map((list) => {
      for (const [key, value] of Object.entries(list.todos)) {
        if (value.id === id) {
          delete list.todos[key];
        }
      };
    });

    // 状態更新を次のレンダリングサイクルに遅延させる
    requestAnimationFrame(() => {
      setData(copiedTodoData);
    });
  }

  function onClickEdit(id: string) {
    const copiedTodoData = { ...data };
    copiedTodoData.lists.map((list) => {
      for (const todo of Object.values(list.todos)) {
        if (todo.id === id) {
          todo.title = editedText ? editedText : todo.title;

          // 状態更新を次のレンダリングサイクルに遅延させる
          requestAnimationFrame(() => {
            setEditedItemId(null);
            setData(copiedTodoData);
          });
        }
      };
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
      todos: {},
    };

    const newData = {
      ...data,
      lists: [...data.lists, newList],
    };

    setData(newData);
  }

  function onClickDeleteContainer() {
    const shouldDelete = window.confirm(
      '最終日のコンテナが消えてしまいますがよろしいですか？\r\n（todoがある場合、一緒に削除されます。\r\ntodoを消したくない場合は、最終日より前のコンテナに移してください）'
    );

    if (!shouldDelete) return;

    const copiedData = { ...data };
    copiedData.lists.pop();

    setData(copiedData);
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
        <SaveResult isStartToSave={isStartToSave} isCompleted={isCompleted} isFailed={isFailed} />
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
