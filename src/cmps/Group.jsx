import React from 'react';
import { Task } from './Task'

export function Group(props) {
    const tasks = [{ id: 't1', name: 'task1' }, { id: 't2', name: 'task2' }]
    return (
        <section className="group">
            <h1>Group {props.group.name}</h1>
            {tasks.map(task => {
                return <Task onRemoveTask={props.onRemoveTask} key={task.id} task={task} />
            })}
            <button onClick={() => {
                props.onRemoveGroup(props.group.id)
            }}>Delete Group</button>

            <button onClick={() => {
                props.onAddTask(props.group.id)
            }}>Add New Task</button>
        </section>
    )
}