'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export default function TimeSlot({ id, children }) {
  const { setNodeRef } = useDroppable({
    id: id,
  });
  return (
    <div ref={setNodeRef} style={{ height: '50px', border: '1px dashed gray' }}>
      {children}
    </div>
  );
}