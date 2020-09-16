import React from 'react';

export function BoardHeader(props) {

    return (
        <section className="board-header align-center  padding-x-15">
            <div className="col flex column">
                <h1>Board header</h1>
                <p>Change board's description</p>
            </div>
            <div className="col flex align-center">
                <button onClick={props.onAddGroup}>Add Group</button>
            </div>
        </section>
    )
}