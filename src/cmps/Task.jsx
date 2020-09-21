import React, { Component } from 'react';
import { connect } from 'react-redux';
import ContentEditable from 'react-contenteditable'
import { withRouter } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd'
import { RiDeleteBack2Line } from 'react-icons/ri'
import { BsChatDots } from 'react-icons/bs'
import "react-datepicker/dist/react-datepicker.css";

//Material ui
import { Tooltip, Zoom } from '@material-ui/core';

// Inside Imports
import { cloudinaryService } from '../services/cloudinaryService';
import { Members } from './task-cmps/Members';
import { Status } from './task-cmps/Status'
import { Date } from './task-cmps/Date';
import { Priority } from './task-cmps/Priority';
import { Updates } from './task-cmps/Updates';
import { Tags } from './task-cmps/Tags';

class _Task extends Component {

    state = {
        id: '',
        isStatusShown: false,
        isPriorityShown: false,
        isUsersShown: false,
        isUpdatesShown: false,
        isTagsShown: false
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

    handleChange = async (data, tags) => {
        if (data === 'Stuck' || data === 'Working on it' || data === 'Done') {

            await this.setState({ status: data })
            this.props.onEditTask(this.state)
        } else if (data === 'tag') {
            console.log('IMHERE, data:', data, 'tag:', tags)
            await this.setState({ ...this.state, tags })
            this.props.onEditTask(this.state, tags)
        } else {
            await this.setState({ priority: data })
            this.props.onEditTask(this.state)
        }

    }

    uploadImg = async (ev, user) => {
        const res = await cloudinaryService.uploadImg(ev)
        const newImg = {
            member: this.props.loggedUser.fullName,
            txt: res.url
        }
        this.setState({ updates: [newImg, ...this.state.updates] })
        this.props.onEditTask(this.state)
    }

    sendNote = async (updates) => {
        await this.setState({ updates })
        this.props.onEditTask(this.state)
    }

    openModal = (data) => {
        switch (data) {
            case 'status':
                this.setState({ isStatusShown: !this.state.isStatusShown })
                break;
            case 'users':
                this.setState({ isUsersShown: !this.state.isUsersShown })
                break;
            case 'updates':
                this.setState({ isUpdatesShown: !this.state.isUpdatesShown })
                break;
            case 'priority':
                this.setState({ isPriorityShown: !this.state.isPriorityShown })
                break;
            case 'tags':
                this.setState({ isTagsShown: !this.state.isTagsShown })
                break;
            default:
                break;
        }
    }

    closeModal = () => {
        this.setState({ isStatusShown: false, isUsersShown: false, isPriorityShown: false, isUpdatesShown: false, isTagsShown: false })
    }

    onRemoveMemberFromTask = async (memberId) => {
        await this.setState({ members: this.state.members.filter(member => member._id !== memberId) })
        this.props.onEditTask(this.state)
    }

    onAddUserToTask = async (userId) => {
        const newUser = this.props.users.find(user => user._id === userId)
        await this.setState({ members: [...this.state.members, newUser] })
        this.props.onEditTask(this.state)
    }

    goToUserProfile = (userId) => {
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
        const { isUsersShown, isStatusShown, isPriorityShown, isUpdatesShown, isTagsShown } = this.state
        return (
            <React.Fragment>
                <div className={`${isUpdatesShown && 'animate-side-modal'} side-modal`}>
                    <Updates loggedUser={this.props.loggedUser}
                        updates={this.state.updates} uploadImg={this.uploadImg} sendNote={this.sendNote}
                    />
                </div>

                {(isUsersShown || isStatusShown || isPriorityShown || isUpdatesShown || isTagsShown) && <div className="modal-screen-wrapper" onClick={this.closeModal}></div>}
                <Draggable draggableId={this.state.id} index={this.props.index}>
                    {(provided, snapshot) => (
                        <section key={this.props.task.id} className={`task flex space-between align-center ${snapshot.isDragging ? 'drag' : ''}`}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                        >

                            <div className="task-left flex align-center">
                                <div style={{ backgroundColor: this.props.group.color }} className="task-color"></div>
                                <Tooltip enterDelay={200} TransitionComponent={Zoom} title="Delete Task" arrow>
                                    <div className='icon-container'>
                                        <RiDeleteBack2Line className="task-remove-icon" onClick={() => { this.props.onRemoveTask(this.state.id) }} />
                                    </div>
                                </Tooltip>
                                <h2>
                                    <ContentEditable
                                        onFocus={this.focusText}
                                        className="cursor-initial content-editable"
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

                                <div>
                                    <div onClick={() => this.openModal('updates')} className="notes-container relative"><BsChatDots />
                                        {(this.state.updates.length !== 0) && <div className="task-number-of-imgs flex justify-center align-center"><span>{this.state.updates.length}</span></div>}
                                    </div>
                                </div>

                                <Members members={this.state.members} users={this.props.users} isUsersShown={isUsersShown}
                                    openModal={this.openModal} goToUserProfile={this.goToUserProfile} onAddUserToTask={this.onAddUserToTask}
                                    onRemoveMemberFromTask={this.onRemoveMemberFromTask} />
                                <Status status={this.state.status} isStatusShown={isStatusShown}
                                    handleChange={this.handleChange} openModal={this.openModal} />
                                <Date dueDate={this.state.dueDate} handleDateChange={this.handleDateChange} />
                                <Priority priority={this.state.priority} isPriorityShown={isPriorityShown}
                                    openModal={this.openModal} handleChange={this.handleChange} />
                                <Tags handleChange={this.handleChange} onEditTask={this.props.onEditTask} tags={this.state.tags} isTagsShown={isTagsShown}
                                    openModal={this.openModal} handleChange={this.handleChange} />
                            </div>
                        </section>

                    )}
                </Draggable>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        loggedUser: state.userReducer.loggedUser
    }
}


export const Task = connect(mapStateToProps)(withRouter(_Task));