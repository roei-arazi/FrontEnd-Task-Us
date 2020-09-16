import React from 'react';
import {Draggable} from 'react-beautiful-dnd'

export function Task(props) {

    return (
        <Draggable draggableId={props.task.id} index={props.index}>
            {provided=>(
        <section className="task"
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        >
            <h1>task: {props.task.name}</h1>
            <button onClick={() => { props.onRemoveTask(props.task.id) }}>Remove task</button>
        </section>
            )}
        </Draggable>
    )
}