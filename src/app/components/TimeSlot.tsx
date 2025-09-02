'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export default function TimeSlot({ id, listId, time, children, isEditing, onSlotClick, onCreateTodo} : {
  id: string;
  listId: string;
  time: string;
  children: React.ReactNode;
}){
  const { setNodeRef } = useDroppable({
    id: id,
    data: {
      listId: listId,
      time: time,
      accepts: ['todo-item'], // 例えば「TODOアイテムのみ受け入れる」といった情報も追加できる
    }
  });
    // 1. もしTODOが存在すれば、TODOアイテムを表示
  if (children) {
    return (
      <div className="h-20 outline-gray-700 outline-1 outline-dashed">
        {children}
      </div>
    );
  }

  // 2. もし編集中なら、新規作成フォームを表示
  if (isEditing) {
    return (
      <div className="time-slot">
      </div>
    );
  }

  return (
    <div ref={setNodeRef} className="h-20 outline-gray-700 outline-1 outline-dashed">
      {children}
    </div>
  );
}