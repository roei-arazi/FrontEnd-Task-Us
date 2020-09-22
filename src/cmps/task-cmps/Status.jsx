import React from 'react'

export function Status(props) {
    return (
        <div className="label-container relative flex align-center">
            <div className={`label-box ${props.status.split(" ")[0].toLowerCase()}`} onClick={() => props.openModal('status')}>
                <div className="task-label-name flex align-center justify-center">
                <p>{props.status}</p>
                </div>
                {props.isStatusShown &&
                    <div className="label-list absolute flex column align-center">
                        <section className="label-selector flex align-center justify-center stuck" onClick={() => props.handleChange("Stuck")}>
                            <p>Stuck</p>
                        </section>
                        <section className="label-selector flex align-center justify-center working" onClick={() => props.handleChange("Working on it")}>
                            <p>Working on it</p>
                        </section>
                        <section className="label-selector flex align-center justify-center done" onClick={() => props.handleChange("Done")}>
                            <p>Done</p>
                        </section>
                    </div>
                }

            </div>
        </div>
    )
}