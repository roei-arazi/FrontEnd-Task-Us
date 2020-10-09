import React from 'react'
import { Fade } from '@material-ui/core'

export function Status(props) {
    const { modalPosition, isAuth } = props;
    return (
        <div className="label-container relative flex align-center ">

            <div className={`label-box ${props.status.split(" ")[0].toLowerCase()}`} onClick={(ev) => {
                if (!isAuth) return
                props.openModal('status', ev)
            }}>
                <div className="task-label-name flex align-center justify-center">
                    <p>{props.status === 'empty' ? ' ' : props.status}</p>
                </div>
                <Fade in={props.isStatusShown} >
                    <div onClick={(ev) =>
                        ev.stopPropagation()
                    } style={modalPosition} className="label-list fixed flex column align-center modal-fade-in">
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