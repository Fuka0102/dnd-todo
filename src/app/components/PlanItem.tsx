'use client';

import React, { MouseEventHandler } from 'react';
import { useSortable } from "@dnd-kit/sortable";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";

export default function PlanItem ({ id, title, onClickDelete, onClickEdit } : { 'id': string, 'title': string, 'onClickDelete': MouseEventHandler<HTMLElement>, 'onClickEdit': MouseEventHandler<HTMLElement>}) {
    const { attributes, listeners, setNodeRef, transform } =
    useSortable({ id });

    const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div className="w-full inline-flex items-center gap-x-3 py-4 px-4 cursor-grab text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg" ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {title}
            <div className="flex align-center">
                <button onClick={onClickDelete} className="prime:pen-to-square"><RiDeleteBinLine /></button>
                <button onClick={onClickEdit} className="ml-2"><FiEdit2 /></button>
            </div>
            <svg className="shrink-0 size-4 ms-auto text-gray-400 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="12" r="1"></circle>
                <circle cx="9" cy="5" r="1"></circle>
                <circle cx="9" cy="19" r="1"></circle>
                <circle cx="15" cy="12" r="1"></circle>
                <circle cx="15" cy="5" r="1"></circle>
                <circle cx="15" cy="19" r="1"></circle>
            </svg>
        </div>
    );
}