
import { useDroppable } from '@dnd-kit/core';

function Droppable (props) {
    const {setNodeRef} = useDroppable({
        id: props.id,
    });
    
    console.log(props)
    return (
        <div ref={setNodeRef}>
            {props.children}
        </div>
    );
}

export default Droppable;