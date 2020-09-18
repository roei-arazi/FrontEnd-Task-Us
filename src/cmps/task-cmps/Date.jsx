import React from 'react'
import DatePicker from "react-datepicker";

export function Date(props){
    return(
        <label>
        <DatePicker
            selected={props.dueDate}
            onChange={props.handleDateChange}
            dateFormat="dd/MM/yyyy"
        />
    </label>
    )
}