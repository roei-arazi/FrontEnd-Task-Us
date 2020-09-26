import { Fade } from '@material-ui/core'
import React from 'react'

export function Priority(props) {
    return (
        <div className="label-container relative flex align-center">
            <div className={`label-box ${props.priority.toLowerCase()}`} onClick={() => props.openModal('priority')}>
                <div className="task-label-name flex align-center justify-center">
                    <p>{props.priority}</p>
                </div>
                <Fade in={props.isPriorityShown} >
                    <div className="label-list absolute flex column align-center modal-fade-in">
                        <section className="label-selector flex align-center justify-center low" onClick={() => props.handleChange("Low")}>
                            <p>Low</p>
                        </section>
                        <section className="label-selector flex align-center justify-center medium" onClick={() => props.handleChange("Medium")}>
                            <p>Medium</p>
                        </section>
                        <section className="label-selector flex align-center justify-center high" onClick={() => props.handleChange("High")}>
                            <p>High</p>
                        </section>
                    </div>
                </Fade>

            </div>
        </div>
    )
}