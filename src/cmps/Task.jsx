import React, { Component } from 'react';
import ContentEditable from 'react-contenteditable'
import { Draggable } from 'react-beautiful-dnd'
import DatePicker from "react-datepicker";
import es from 'date-fns/locale/es'
import "react-datepicker/dist/react-datepicker.css";
//Material ui
import { Tooltip, Zoom, FormControl, MenuItem, Select, InputLabel } from '@material-ui/core';
import { MdDeleteSweep } from 'react-icons/md'
import { cloudinaryService } from '../services/cloudinaryService';

export class Task extends Component {

    state = {
        id: '',
        isStatusShown: false,
        isPriorityShown: false
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

    handleChange = async (data) => {
        if (data === 'Stuck' || data === 'Working on it' || data === 'Done') {

            await this.setState({ status: data })
        } else await this.setState({ priority: data })
        this.props.onEditTask(this.state)
    }

    uploadImg = async (ev) => {
        const res = await cloudinaryService.uploadImg(ev)
        this.setState({ attachedImgs: [res.url, ...this.state.attachedImgs] })
        this.props.onEditTask(this.state)
    }

    openModal = (data) => {
        if (data === 'status') {
            this.setState({ isStatusShown: !this.state.isStatusShown })

        } else {
            this.setState({ isPriorityShown: !this.state.isPriorityShown })
        }
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
                            <label>
                                <DatePicker
                                    selected={this.state.dueDate}
                                    onChange={this.handleDateChange}
                                    dateFormat="dd/MM/yyyy"
                                />
                            </label>
                            <div className="label-container relative">
                                <div className={`label-box ${this.state.status.split(" ")[0].toLowerCase()}`} onClick={() => this.openModal('status')}>
                                    <p>{this.state.status}</p>
                                    {this.state.isStatusShown &&
                                        <div className="label-list absolute flex column align-center">
                                            <section className="label-selector stuck" onClick={() => this.handleChange("Stuck")}>
                                                <p>Stuck</p>
                                            </section>
                                            <section className="label-selector working" onClick={() => this.handleChange("Working on it")}>
                                                <p>Working on it</p>
                                            </section>
                                            <section className="label-selector done" onClick={() => this.handleChange("Done")}>
                                                <p>Done</p>
                                            </section>
                                        </div>
                                    }

                                </div>
                            </div>

                            <div className="label-container relative">
                                <div className={`label-box ${this.state.priority.toLowerCase()}`} onClick={() => this.openModal('priority')}>
                                    <p>{this.state.priority}</p>
                                    {this.state.isPriorityShown &&
                                        <div className="label-list absolute flex column align-center">
                                            <section className="label-selector low" onClick={() => this.handleChange("Low")}>
                                                <p>Low</p>
                                            </section>
                                            <section className="label-selector medium" onClick={() => this.handleChange("Medium")}>
                                                <p>Medium</p>
                                            </section>
                                            <section className="label-selector high" onClick={() => this.handleChange("High")}>
                                                <p>High</p>
                                            </section>
                                        </div>
                                    }

                                </div>
                            </div>

                            <div className="task-img-container">
                                <label htmlFor="task-imgs">{this.state.attachedImgs.length ? <img src={this.state.attachedImgs[0]} /> : 'IMG'}</label>
                                <input type="file" id="task-imgs" onChange={this.uploadImg} hidden />
                                <div className="task-number-of-imgs"><span>{this.state.attachedImgs.length ? this.state.attachedImgs.length : 0}</span></div>
                            </div>
                            <div className="user-img-container">
                                {this.state.members ? this.state.members[0].imgUrl ? <img src={this.state.members[0].imgUrl} /> :
                                    <div className="member-letter">{this.state.members[0].name.charAt(0).toUpperCase()}</div> : ''}
                                <div className="task-number-of-imgs"><span>+{this.state.members.length ? this.state.members.length : 0}</span></div>
                            </div>
                        </div>
                    </section>
                )}
            </Draggable>
        )
    }
}