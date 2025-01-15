'use client';

import React from 'react';
import {useDroppable} from '@dnd-kit/core';

export default function PlanColumn (props: { 'children': React.ReactElement | string }) {
    console.log(props)
    const {isOver, setNodeRef} = useDroppable({
        id: 'droppable1',
    });
    const style = {
        color: isOver ? 'green' : undefined,
    };

    return (
        <div ref={setNodeRef} style={style}>
            {props.children}
        </div>
    );
}