import React, { Component } from 'react';
import ContentEditable from 'react-contenteditable'
import { Draggable } from 'react-beautiful-dnd'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//Material ui
import { Tooltip, Zoom, FormControl, MenuItem, Select, InputLabel } from '@material-ui/core';
import { MdDeleteSweep } from 'react-icons/md'
import { cloudinaryService } from '../services/cloudinaryService';

export class Task extends Component {

    state = {
        id: '',
        startDate: new Date()
    }

    componentDidMount() {
        this.contentEditable = React.createRef();
        this.setState({ ...this.props.task })
    }

    handleNameChange = (ev) => {
        this.setState({ name: ev.target.value });
    }

    handleDateChange = date => {
        this.setState({ dueDate: date })
        this.props.onEditTask(this.state)
    }

    handleChange = async (ev) => {
        await this.setState({ [ev.target.name]: ev.target.value })
        this.props.onEditTask(this.state)
    }

    uploadImg = async (ev) => {
        const res = await cloudinaryService.uploadImg(ev)
        this.setState({ attachedImgs: [res.url, ...this.state.attachedImgs] })
        this.props.onEditTask(this.state)
    }

    render() {
        if (!this.state.id) return <h1>Loading...</h1>
        const elTaskName = this.state.name
        return (
            <Draggable draggableId={this.state.id} index={this.props.index}>
                {(provided, snapshot) => (
                    <section key={this.props.task.id} className={`task flex space-between align-center ${snapshot.isDragging ? 'drag' : ''}`}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >

                        <div className="task-left flex">
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
                        </div>
                        <div className="task-right flex align-center">
                            <DatePicker
                                selected={this.state.dueDate}
                                onChange={this.handleDateChange}
                            />
                            <FormControl className="status">
                                <Select
                                    labelId="task-status-label"
                                    id="task-status"
                                    value={this.state.status}
                                    name="status"
                                    onChange={this.handleChange}
                                >
                                    <MenuItem value="stuck" className="red">Stuck</MenuItem>
                                    <MenuItem value="working on it" className="yellow">Working on it</MenuItem>
                                    <MenuItem value="done" className="green">Done</MenuItem>
                                </Select>
                            </FormControl>
                            
                            <FormControl className="priority">
                                <Select
                                    labelId="task-priority-label"
                                    id="task-priority"
                                    value={this.state.priority}
                                    name="priority"
                                    onChange={this.handleChange}
                                >
                                    <MenuItem value="low" className="green">Low</MenuItem>
                                    <MenuItem value="medium" className="yello">Medium</MenuItem>
                                    <MenuItem value="high" className="red">High</MenuItem>
                                </Select>
                            </FormControl>
                            <div className="task-img-container">
                                <label htmlFor="task-imgs">{this.state.attachedImgs.length ? <img src={this.state.attachedImgs[0]} /> : 'IMG'}</label>
                                <input type="file" id="task-imgs" onChange={this.uploadImg} hidden />
                                <div className="task-number-of-imgs">{this.state.attachedImgs.length ? this.state.attachedImgs.length : 0}</div>
                            </div>
                            <div className="user-img-container">
                                {this.state.members ? this.state.members[0].imgUrl ? <img src={this.state.members[0].imgUrl} /> :
                                    <div className="member-letter">{this.state.members[0].name.charAt(0).toUpperCase()}</div> : ''}
                                <div className="task-number-of-imgs">{this.state.members.length ? this.state.members.length : 0}</div>
                            </div>
                        </div>
                    </section>
                )}
            </Draggable>
        )
    }
}