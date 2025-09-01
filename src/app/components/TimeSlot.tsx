'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export default function TimeSlot({ id, listId, time, children } : {
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
  return (
    <div ref={setNodeRef} style={{ height: '50px', border: '1px dashed gray' }}>
      {children}
    </div>
  );
}