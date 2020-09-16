import React from 'react';

export function BoardHeader(props) {

    return (
        <section className="board-header">
            <h1>Board header</h1>
            <p>Change board's description</p>
            <button onClick={props.onAddGroup}>Add Group</button>
        </section>
    )
}