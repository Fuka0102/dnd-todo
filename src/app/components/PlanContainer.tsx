'use client';

import React, {useState} from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import PlanColumn from './PlanColumn';
import PlanItem from './PlanItem';

export default function PlanContainer () {
    const [isDropped, setIsDropped] = useState(false);
    const draggableMarkup = (
        <PlanItem>Drag me</PlanItem>
    );

    function handleDragEnd (event : DragEndEvent) {
        if (event.over && event.over.id === 'droppable') {
            setIsDropped(true);
        }
    }
    
    return (
        <DndContext onDragEnd={handleDragEnd} >
            {!isDropped ? draggableMarkup : null}
            <PlanColumn>
                {isDropped ? draggableMarkup : 'Drop here'}
            </PlanColumn>
        </DndContext>
    )
}