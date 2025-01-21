'use client';

import React, { MouseEventHandler } from 'react';
import { useSortable } from "@dnd-kit/sortable";

export default function PlanItem ({ id, title, onClickDelete, onClickEdit } : { 'id': string, 'title': string, 'onClickDelete': MouseEventHandler<HTMLElement>, 'onClickEdit': MouseEventHandler<HTMLElement>}) {
    const { attributes, listeners, setNodeRef, transform } =
    useSortable({ id });

    const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {title}
            <div>
                <button onClick={onClickDelete}>削除</button>
                <button onClick={onClickEdit}>編集</button>
            </div>
        </div>
    );
}