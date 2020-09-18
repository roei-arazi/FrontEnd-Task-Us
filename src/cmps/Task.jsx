import React, { Component } from 'react';
import ContentEditable from 'react-contenteditable'
import { withRouter } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd'
import "react-datepicker/dist/react-datepicker.css";

//Material ui
import { Tooltip, Zoom } from '@material-ui/core';
import { MdDeleteSweep } from 'react-icons/md'

// Inside Imports
import { cloudinaryService } from '../services/cloudinaryService';
import { Members } from './task-cmps/Members';
import { Status } from './task-cmps/Status'
import { Date } from './task-cmps/Date';
import { Priority } from './task-cmps/Priority';
import { Images } from './task-cmps/Images';

class _Task extends Component {

    state = {
        id: '',
        isStatusShown: false,
        isPriorityShown: false,
        isUsersShown: false
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

        } else if (data === 'users') {
            this.setState({ isUsersShown: !this.state.isUsersShown })
        }
        else {
            this.setState({ isPriorityShown: !this.state.isPriorityShown })
        }
    }

    closeModal = () => {
        this.setState({ isStatusShown: false, isUsersShown: false, isPriorityShown: false })
    }

    onRemoveMemberFromTask = (memberId) => {
        this.setState({ members: this.state.members.filter(member => member._id !== memberId) })
    }

    onAddUserToTask = (userId) => {
        const newUser = this.props.users.find(user => user._id === userId)
        this.setState({ members: [...this.state.members, newUser] })
        // this.props.addUserToTask()
    }

    goToUserProfile(userId) {
        this.props.history.push(`/user/${userId}`)
    }

    focusText = () => {
        setTimeout(() => {
            document.execCommand('selectAll', false, null)
        }, 0)
    }

    render() {
        if (!this.state.id) return <h1>Loading...</h1>
        const elTaskName = this.state.name;
        const { isUsersShown, isStatusShown, isPriorityShown } = this.state
        console.log(this.state.priority);
        return (
            <React.Fragment>
                {(isUsersShown || isStatusShown || isPriorityShown) && <div className="modal-screen-wrapper" onClick={this.closeModal}></div>}
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
                                        onFocus={this.focusText}
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
                                <Members members={this.state.members} users={this.props.users} isUsersShown={isUsersShown}
                                    openModal={this.openModal} goToUserProfile={this.goToUserProfile} onAddUserToTask={this.onAddUserToTask}
                                    onRemoveMemberFromTask={this.onRemoveMemberFromTask} />
                                <Status status={this.state.status} isStatusShown={isStatusShown}
                                    handleChange={this.handleChange} openModal={this.openModal} />
                                <Date dueDate={this.state.dueDate} handleDateChange={this.handleDateChange} />
                                <Priority priority={this.state.priority} isPriorityShown={isPriorityShown}
                                    openModal={this.openModal} handleChange={this.handleChange} />
                                <Images attachedImgs={this.state.attachedImgs} uploadImg={this.uploadImg} />
                                <button onClick={this.props.onToggleUpdates}>UPDATES LOL</button>
                            </div>
                        </section>
                    )}
                </Draggable>
            </React.Fragment>
        )
    }
}

export const Task = withRouter(_Task)