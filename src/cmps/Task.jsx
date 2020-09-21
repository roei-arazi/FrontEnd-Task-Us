import React, { Component } from 'react';
import { connect } from 'react-redux';
import ContentEditable from 'react-contenteditable'
import { withRouter } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd'
import { RiDeleteBack2Line } from 'react-icons/ri'
import { BsChatDots } from 'react-icons/bs'
import "react-datepicker/dist/react-datepicker.css";
import socketService from '../services/socketService.js'
import moment from 'moment';
//Material ui
import { Tooltip, Zoom } from '@material-ui/core';

// Inside Imports
import { Members } from './task-cmps/Members';
import { Status } from './task-cmps/Status'
import { Date } from './task-cmps/Date';
import { Priority } from './task-cmps/Priority';
import { Updates } from './task-cmps/Updates';
import { Tags } from './task-cmps/Tags';
import Truncate from 'react-truncate';

class _Task extends Component {

    state = {
        id: '',
        isStatusShown: false,
        isPriorityShown: false,
        isUsersShown: false,
        isUpdatesShown: false,
        isTagsShown: false,
        imgUrl: '',
        isImageModalShown: false
    }

    componentDidMount() {
        this.contentEditable = React.createRef();
        socketService.on('updatedBoard', () => {

            this.setState({ task: this.props.task })
        })
        this.setState({
            ...this.state,
            task: this.props.task,
            isStatusShown: false,
            isPriorityShown: false,
            isUsersShown: false,
            isUpdatesShown: false,
            isTagsShown: false
        })
    }

    handleNameChange = (ev) => {
        this.setState({task:{...this.state.task, name: ev.target.value} });
    }

    handleDateChange = date => {
        this.setState({task:{...this.state.task, dueDate: moment(date).valueOf()}}, () =>{
            this.props.onEditTask(this.state.task)
        })
    }

    handleChange = (data, tags) => {
        if (data === 'Stuck' || data === 'Working on it' || data === 'Done') {
            this.setState({task: {...this.state.task, status: data} }, () =>{
                this.props.onEditTask(this.state.task)
            })
        // } else if (data === 'tag') {
        //     console.log('IMHERE, data:', data, 'tag:', tags)
        //     this.setState({ ...this.state, tags })
        //     this.props.onEditTask(this.state, tags)
        } else {
            this.setState({task:{...this.state.task, priority: data}}, () =>{
                this.props.onEditTask(this.state.task)
            })
        }

    }

    sendNote = (newUpdates) => {
        this.setState({task:{...this.state.task, updates: [...newUpdates]}}, ()=>{
            this.props.onEditTask(this.state.task)
        })
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
        this.setState({ isImageModalShown: false, isStatusShown: false, isUsersShown: false, isPriorityShown: false, isUpdatesShown: false, isTagsShown: false })
    }

    onRemoveMemberFromTask = (memberId) => {
        this.setState({ task: {...this.state.task, members: this.state.task.members.filter(member => member._id !== memberId)}}, ()=>{
            this.props.onEditTask(this.state.task)
        })
    }

    onAddUserToTask = (userId) => {
        const newUser = this.props.users.find(user => user._id === userId)
        this.setState({ task:{...this.state.task, members: [...this.state.task.members, newUser]}}, ()=>{
            this.props.onEditTask(this.state.task)
        })
    }

    goToUserProfile = (userId) => {
        this.props.history.push(`/user/${userId}`)
    }

    focusText = () => {
        setTimeout(() => {
            document.execCommand('selectAll', false, null)
        }, 0)
    }

    onToggleImageModal = (imgUrl) => {
        this.setState({ imgUrl, isImageModalShown: !this.state.isImageModalShown })

    }

    render() {
        if (!this.state.task) return <h1>Loading...</h1>
        const {name, members, status, priority, dueDate, updates, id} = this.state.task;
        const { isUsersShown, isStatusShown, isPriorityShown, isUpdatesShown, isTagsShown } = this.state
        return (
            <React.Fragment>
                <div className={`${isUpdatesShown && 'animate-side-modal'} side-modal`}>
                    <Updates isImageModalShown={this.state.isImageModalShown}
                        loggedUser={this.props.loggedUser} updates={updates}
                        onToggleImageModal={this.onToggleImageModal}
                        uploadImg={this.uploadImg} sendNote={this.sendNote}
                    />
                </div>

                {(isUsersShown || isStatusShown || isPriorityShown || isUpdatesShown || isTagsShown) && <div className="modal-screen-wrapper" onClick={this.closeModal}></div>}
                <Draggable draggableId={id} index={this.props.index}>
                    {(provided, snapshot) => (
                        <section key={id} className={`task flex space-between align-center ${snapshot.isDragging ? 'drag' : ''}`}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                        >

                            <div className="task-left flex align-center">
                                <div style={{ backgroundColor: this.props.group.color }} className="task-color"></div>
                                <Tooltip enterDelay={200} TransitionComponent={Zoom} title="Delete Task" arrow>
                                    <div className='icon-container'>
                                        <RiDeleteBack2Line className="task-remove-icon" onClick={() => { this.props.onRemoveTask(id) }} />
                                    </div>
                                </Tooltip>
                                <h2>
                                    <ContentEditable
                                        onFocus={this.focusText}
                                        className="cursor-initial content-editable"
                                        innerRef={this.contentEditable}
                                        html={name} // innerHTML of the editable div
                                        disabled={false}       // use true to disable editing
                                        onChange={this.handleNameChange} // handle innerHTML change
                                        onBlur={() => {
                                            this.props.onEditTask(this.state.task)
                                        }}
                                        onKeyDown={(ev) => {
                                            if (ev.key === 'Enter') {
                                                ev.target.blur()
                                                this.props.onEditTask(this.state.task)
                                                // this.ChangeEditState()
                                            }
                                        }}
                                    />
                                </h2>
                            </div>

                            <div className="task-right flex align-center">

                                <div>
                                    <div onClick={() => this.openModal('updates')} className="notes-container relative"><BsChatDots />
                                        {(updates.length !== 0) && <div className="task-number-of-imgs flex justify-center align-center"><span>{updates.length}</span></div>}
                                    </div>
                                </div>

                                <Members members={members} users={this.props.users} isUsersShown={isUsersShown}
                                    openModal={this.openModal} goToUserProfile={this.goToUserProfile} onAddUserToTask={this.onAddUserToTask}
                                    onRemoveMemberFromTask={this.onRemoveMemberFromTask} />
                                <Status status={status} isStatusShown={isStatusShown}
                                    handleChange={this.handleChange} openModal={this.openModal} />
                                <Date dueDate={dueDate} handleDateChange={this.handleDateChange} />
                                <Priority priority={priority} isPriorityShown={isPriorityShown}
                                    openModal={this.openModal} handleChange={this.handleChange} />
                                {/* <Tags handleChange={this.handleChange} onEditTask={this.props.onEditTask} tags={this.state.tags} isTagsShown={isTagsShown}
                                    openModal={this.openModal} handleChange={this.handleChange} /> */}
                            </div>
                        </section>

                    )}
                </Draggable>
                {this.state.isImageModalShown &&
                    <div onClick={this.onToggleImageModal} className="updates-image-modal">
                        <img src={this.state.imgUrl} />
                    </div>}
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