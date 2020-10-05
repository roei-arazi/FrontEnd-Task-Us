import { Fade } from '@material-ui/core';
import React from 'react'
import DatePicker from "react-datepicker";

export function Date(props) {
    const {modalPosition} = props;
    const dateRef = React.createRef();
    console.log('ref', dateRef);
    for(let key in modalPosition){
        // dateRef.style[key] = modalPosition[key]
    }

    return (
        <label className="date-picker">
            <Fade >
                <DatePicker
                    selected={props.dueDate}
                    onChange={props.handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    ref={dateRef}
                />
            </Fade >
        </label>
    )
}