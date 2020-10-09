import React from 'react'
import { Fade } from '@material-ui/core'

export function Priority(props) {
    const { modalPosition, isAuth } = props;
    return (
        <div className="label-container relative flex align-center">
            <div className={`label-box ${props.priority.toLowerCase()}`} onClick={(ev) => {
                if (!isAuth) return
                props.openModal('priority', ev)
            }}>
                <div className="task-label-name flex align-center justify-center">
                    <p>{props.priority}</p>
                </div>
                <Fade in={props.isPriorityShown} >
                    <div onClick={(ev) =>
                        ev.stopPropagation()
                    } style={modalPosition} className="label-list fixed flex column align-center modal-fade-in">
                        <section className="label-selector flex align-center justify-center low" onClick={() => props.handleChange('Low', 'priority')}>
                            <p>Low</p>
                        </section>
                        <section className="label-selector flex align-center justify-center medium" onClick={() => props.handleChange('Medium', 'priority')}>
                            <p>Medium</p>
                        </section>
                        <section className="label-selector flex align-center justify-center high" onClick={() => props.handleChange('High', 'priority')}>
                            <p>High</p>
                        </section>
                        <section className="label-selector flex align-center justify-center empty-priority" onClick={() => props.handleChange('', 'priority')}>
                            <p> </p>
                        </section>
                    </div>
                </Fade>
            </div>
        </div>
    )
}