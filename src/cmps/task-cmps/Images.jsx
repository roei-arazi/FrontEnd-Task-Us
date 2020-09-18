import React from 'react'
import { IoIosAddCircle } from 'react-icons/io';

export function Images(props){
    return(
        <div className="task-img-container">
        <label htmlFor="task-imgs">{props.attachedImgs.length ? <img src={props.attachedImgs[0]} /> : <div className="no-images"><IoIosAddCircle /></div>}</label>
        <input type="file" id="task-imgs" onChange={props.uploadImg} hidden />
        {props.attachedImgs.length ?
            <div className="task-number-of-imgs"><span>{props.attachedImgs.length}</span></div> : ''}
    </div>
    )
}