import React from 'react';
import { Task } from './Task'

export function Group(props) {
    return (
        <section className="group padding-x-15 padding-y-15">
            <div className="group-header-container">


                <h1>Group {props.group.name}</h1>
                <button onClick={() => {
                    props.onRemoveGroup(props.group.id)
                }}>Delete Group</button>
            </div>


            {props.group.tasks.map(task => {
                return <Task onRemoveTask={props.onRemoveTask} key={task.id} task={task} />
            })}
            <button onClick={() => {
                props.onAddTask(props.group.id)
            }}>Add New Task</button>
        </section>
    )
}