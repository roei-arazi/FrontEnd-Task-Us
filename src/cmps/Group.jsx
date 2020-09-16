import React from 'react';
import { Task } from './Task'
import { Droppable } from 'react-beautiful-dnd';

export function Group(props) {
    return (
        <section className="group padding-x-15 padding-y-15">
            <div className="group-header-container">
                <h1>Group {props.group.name}</h1>
                <button onClick={() => {
                    props.onRemoveGroup(props.group.id)
                }}>Delete Group</button>
            </div>
            <Droppable droppableId={props.group.id}>
                {provided =>
                    <div className="task-list"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {props.group.tasks.map((task, index) => {
                            return <Task onEditTask={props.onEditTask} index={index} onRemoveTask={props.onRemoveTask} key={task.id} task={task} />
                        })}
                        {provided.placeholder}
                    </div>
                }
            </Droppable>
            <button onClick={() => {
                props.onAddTask(props.group.id)
            }}>Add New Task</button>
        </section>
    )
}