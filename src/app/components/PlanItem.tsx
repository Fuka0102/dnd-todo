'use client';

import React from 'react';
import { useSortable } from "@dnd-kit/sortable";

export default function PlanItem ({ id, title } : { 'id': string, 'title': string }) {
    const { attributes, listeners, setNodeRef, transform } =
    useSortable({ id });

    const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {title}
        </div>
    );
}