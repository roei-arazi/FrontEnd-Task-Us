import React, { Component } from 'react';
import ContentEditable from 'react-contenteditable'
import { Draggable } from 'react-beautiful-dnd'
//Material ui
import { Tooltip, Zoom, TextField, FormControl, MenuItem, Select, InputLabel } from '@material-ui/core';
import { MdDeleteSweep } from 'react-icons/md'

export class Task extends Component {

    state = {
        id: ''
    }

    componentDidMount() {
        this.contentEditable = React.createRef();
        this.setState({ ...this.props.task })
    }

    handleNameChange = (ev) => {
        this.setState({ name: ev.target.value });
    }

    handleDateChange = (ev) => {
        this.setState({ dueDate: ev.target.value })
    }

    handleStatusChange = async (ev) => {
        await this.setState({ status: ev.target.value })
        this.props.onEditTask(this.state)   
    }

    render() {
        if (!this.state.id) return <h1>Loading...</h1>
        const elTaskName = this.state.name
        return (
            <Draggable draggableId={this.state.id} index={this.props.index}>
                {(provided, snapshot) => (
                    <section key={this.props.task.id} className={`task padding-y-15 padding-x-15 align-center ${snapshot.isDragging ? 'drag' : ''}`}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >

                        <Tooltip enterDelay={200} TransitionComponent={Zoom} title="Delete Task" arrow>
                            <div className='icon-container'>
                                <MdDeleteSweep onClick={() => { this.props.onRemoveTask(this.state.id) }} />
                            </div>
                        </Tooltip>
                        <h2>
                            <ContentEditable
                                className="cursor-initial"
                                innerRef={this.contentEditable}
                                html={elTaskName} // innerHTML of the editable div
                                disabled={false}       // use true to disable editing
                                onChange={this.handleNameChange} // handle innerHTML change
                                onBlur={() => {
                                    this.props.onEditTask(this.state)
                                }}
                                onKeyDown={(ev) => {
                                    if (ev.key === 'Enter') {
                                        ev.target.blur()
                                        this.props.onEditTask(this.state)
                                        // this.ChangeEditState()
                                    }
                                }}
                            />
                        </h2>
                        <form className="task-date" noValidate>
                            <TextField
                                id="date"
                                label="Due Date"
                                type="date"
                                value={this.state.dueDate}
                                className="task-date"
                                onChange={this.handleDateChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onBlur={() => {
                                    this.props.onEditTask(this.state)
                                }}
                                onKeyDown={(ev) => {
                                    if (ev.key === 'Enter') {
                                        ev.target.blur()
                                        this.props.onEditTask(this.state)
                                        // this.ChangeEditState()
                                    }
                                }}
                            />
                        </form>
                        <FormControl className="status">
                            <InputLabel id="task-status-label">Age</InputLabel>
                            <Select
                                labelId="task-status-label"
                                id="task-status"
                                value={this.state.status}
                                onChange={this.handleStatusChange}
                            >
                                <MenuItem value="stuck">Stuck</MenuItem>
                                <MenuItem value="working on it">Working on it</MenuItem>
                                <MenuItem value="done">Done</MenuItem>
                            </Select>
                        </FormControl>
                    </section>
                )}
            </Draggable>
        )
    }
}