import React from 'react'

export function Images(props){
    return(
        <div className="task-img-container">
        <label htmlFor="task-imgs">{props.attachedImgs.length ? <img src={props.attachedImgs[0]} /> : ''}</label>
        <input type="file" id="task-imgs" onChange={props.uploadImg} hidden />
        {props.attachedImgs.length ?
            <div className="task-number-of-imgs"><span>{props.attachedImgs.length}</span></div> : ''}
    </div>
    )
}