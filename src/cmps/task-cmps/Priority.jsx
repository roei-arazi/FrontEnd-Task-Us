import React from 'react'

export function Priority(props){
    return(
        <div className="label-container relative">
        <div className={`label-box ${props.priority.toLowerCase()}`} onClick={() => props.openModal('priority')}>
            <p>{props.priority}</p>
            {props.isPriorityShown &&
                <div className="label-list absolute flex column align-center">
                    <section className="label-selector low" onClick={() => props.handleChange("Low")}>
                        <p>Low</p>
                    </section>
                    <section className="label-selector medium" onClick={() => props.handleChange("Medium")}>
                        <p>Medium</p>
                    </section>
                    <section className="label-selector high" onClick={() => props.handleChange("High")}>
                        <p>High</p>
                    </section>
                </div>
            }

        </div>
    </div>
    )
}