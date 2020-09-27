import React from 'react'
import { Fade } from '@material-ui/core'

export function Status(props) {
    return (
        <div className="label-container relative flex align-center ">

            <div className={`label-box ${props.status.split(" ")[0].toLowerCase()}`} onClick={() => props.openModal('status')}>
                <div className="task-label-name flex align-center justify-center">
                    <p>{props.status === 'empty' ? ' ' : props.status}</p>
                </div>
                <Fade in={props.isStatusShown} >
                    <div className="label-list absolute flex column align-center modal-fade-in">
                        <section className="label-selector flex align-center justify-center stuck" onClick={() => props.handleChange('Stuck', 'status')}>
                            <p>Stuck</p>
                        </section>
                        <section className="label-selector flex align-center justify-center working" onClick={() => props.handleChange('Working on it', 'status')}>
                            <p>Working on it</p>
                        </section>
                        <section className="label-selector flex align-center justify-center done" onClick={() => props.handleChange('Done', 'status')}>
                            <p>Done</p>
                        </section>
                        <section className="label-selector flex align-center justify-center empty" onClick={() => props.handleChange('', 'status')}>
                            <p> </p>
                        </section>
                    </div>
                </Fade>
            </div>
        </div>
    )
}