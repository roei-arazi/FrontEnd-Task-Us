import React from 'react';
import { Task } from './Task'

export function Group(props) {
    const tasks = [{ name: 'task1' }, { name: 'task2' }]
    return (
        <section className="group">
            <h1>Group {props.group.name}</h1>
            {tasks.map(task => {
                return <Task task={task} />
            })}
            <button onClick={() => {
                props.onRemoveGroup(props.group._id)
            }}>Delete Group</button>
        </section>
    )
}