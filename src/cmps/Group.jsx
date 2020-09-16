import React from 'react';
import { Task } from './Task'
import { Droppable } from 'react-beautiful-dnd';

export function Group(props) {
    const tasks = [{ id: 't1', name: 'task1' }, { id: 't2', name: 'task2' }]
    return (
        <section className="group">
            <h1>Group {props.group.name}</h1>
            <Droppable droppableId={props.group.id}>
                {provided=>
                <div className="task-list"
                ref={provided.innerRef}
                {...provided.droppableProps}
                >
            {tasks.map((task,index) => {
                return <Task index={index} onRemoveTask={props.onRemoveTask} key={task.id} task={task} />
            })}
            {provided.placeholder}
            </div>
                }
            </Droppable>
            <button onClick={() => {
                props.onRemoveGroup(props.group.id)
            }}>Delete Group</button>

            <button onClick={() => {
                props.onAddTask(props.group.id)
            }}>Add New Task</button>
        </section>
    )
}