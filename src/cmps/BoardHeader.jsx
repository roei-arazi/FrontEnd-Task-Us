import React from 'react';
import { BiAddToQueue } from 'react-icons/bi'
import { Tooltip, Zoom } from '@material-ui/core';


export function BoardHeader(props) {

    return (
        <section className="board-header align-center padding-x-30 padding-y-30 ">
            <div className="col flex column">
                <h1>Board header</h1>
                <p>Change board's description</p>
            </div>
            <div className="col flex align-center">
                <Tooltip enterDelay={200} TransitionComponent={Zoom} title="Add Group" arrow>
                    <div className='icon-container'>
                        <BiAddToQueue onClick={props.onAddGroup} />
                    </div>
                </Tooltip>

            </div>
        </section>
    )
}