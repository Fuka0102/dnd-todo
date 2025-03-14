
import { useDroppable } from '@dnd-kit/core';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

function Droppable (props: { id: any; children: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) {
    const {setNodeRef} = useDroppable({
        id: props.id,
    });
    
    return (
        <div ref={setNodeRef}>
            {props.children}
        </div>
    );
}

export default Droppable;