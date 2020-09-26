import React, { Component } from 'react';
import { connect } from 'react-redux';
import ContentEditable from 'react-contenteditable'
import { withRouter } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd'
import { RiDeleteBack2Line } from 'react-icons/ri'
import { BsChatDots } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'
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

    reloadProps = () => {
        this.setState({ task: this.props.task })
    }

    componentDidMount() {
        this.contentEditable = React.createRef();
        socketService.on('updatedBoard', this.reloadProps)
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

    componentWillUnmount() {
        socketService.off('updatedBoard', this.reloadProps)
    }

    handleNameChange = (ev) => {
        this.setState({ task: { ...this.state.task, name: ev.target.value } });
    }

    handleDateChange = date => {

        const prevDate = moment(this.state.task.dueDate).format('DD/MMM/YYYY')
        const changedDate = moment(date).format('DD/MMM/YYYY')
        if (prevDate === changedDate) return

        this.setState({ task: { ...this.state.task, dueDate: moment(date).valueOf() } }, () => {

            const desc = `${this.props.loggedUser.fullName} changed task ${this.state.task.name} date from ${moment(this.props.task.dueDate).format('DD/MMM/YYYY')} to ${moment(this.state.task.dueDate).format('DD/MMM/YYYY')} at group -${this.props.group.name}`

            this.props.onEditTask(this.state.task, this.props.task, desc)
        })
    }

    handleChange = (data, tags) => {

        let desc = ''

        if (data === 'Stuck' || data === 'Working on it' || data === 'Done') {
            this.setState({ task: { ...this.state.task, status: data } }, () => {

                desc = `${this.props.loggedUser.fullName} changed task: ${this.state.task.name} status from ${this.props.task.status} to ${this.state.task.status} at group - ${this.props.group.name}`

                this.props.onEditTask(this.state.task, this.props.task, desc)
                if (!this.state.isUpdatesShown) this.closeModal()
            })
        } else {
            this.setState({ task: { ...this.state.task, priority: data } }, () => {

                desc = `${this.props.loggedUser.fullName} changed task: ${this.state.task.name} priority from ${this.props.task.priority} to ${this.state.task.priority} at group - ${this.props.group.name}`

                this.props.onEditTask(this.state.task, this.props.task, desc)

                this.closeModal()
            })
        }

    }

    sendNote = (newUpdates) => {
        let desc = ''

        this.setState({ task: { ...this.state.task, updates: [...newUpdates] } }, () => {

            desc = `${this.props.loggedUser.fullName} sent an update at task: ${this.props.task.name} at group - ${this.props.group.name}`

            this.props.onEditTask(this.state.task, this.props.task, desc)
        })
    }

    openModal = (data) => {
        switch (data) {
            case 'status':
                this.setState({ isStatusShown: true })
                break;
            case 'users':
                this.setState({ isUsersShown: true })
                break;
            case 'updates':
                this.setState({ isUpdatesShown: true })
                break;
            case 'priority':
                this.setState({ isPriorityShown: true })
                break;
            case 'tags':
                this.setState({ isTagsShown: true })
                break;
            default:
                break;
        }
    }

    closeModal = () => {
        this.setState({ isImageModalShown: false, isStatusShown: false, isUsersShown: false, isPriorityShown: false, isUpdatesShown: false, isTagsShown: false })
    }

    onRemoveMemberFromTask = (memberId) => {
        let desc = ''
        const removedMember = this.state.task.members.find(member => member._id === memberId)
        this.setState({ task: { ...this.state.task, members: this.state.task.members.filter(member => member._id !== memberId) } }, () => {
            desc = `${this.props.loggedUser.fullName} removed ${removedMember.fullName} from ${this.state.task.name} at group - ${this.props.group.name}`

            this.props.onEditTask(this.state.task, this.props.task, desc)
        })
    }

    onAddUserToTask = (userId) => {
        let desc = ''

        const newUser = this.props.users.find(user => user._id === userId)
        this.setState({ task: { ...this.state.task, members: [...this.state.task.members, newUser] } }, () => {

            desc = `${this.props.loggedUser.fullName} tasked ${newUser.fullName} to ${this.state.task.name} on group - ${this.props.group.name}`

            this.props.onEditTask(this.state.task, this.props.task, desc)
        })
    }

    goToUserProfile = (userId) => {
        this.props.history.push(`/user/${userId}`)
        this.closeModal()
    }

    focusText = () => {
        setTimeout(() => {
            document.execCommand('selectAll', false, null)
        }, 0)
    }

    onEditTags = (tags, tagName, type) => {
        let desc = ''
        console.log('type:', type)
        this.setState({ ...this.state, task: { ...this.state.task, tags: JSON.parse(JSON.stringify(tags)) } }, () => {
            if (type === 'addTag') {
                desc = `${this.props.loggedUser.fullName} added tag named ${tagName} to ${this.state.task.name} on group - ${this.props.group.name}`
            }
            else if (type === 'removeTag') {
                desc = `${this.props.loggedUser.fullName} removed tag named ${tagName} from ${this.state.task.name} on group - ${this.props.group.name}`
            }
            this.props.onEditTask(this.state.task, this.props.task, desc)
        })
    }



    render() {

        if (!this.state.task) return <h1>Loading...</h1>
        const { name, members, status, priority, dueDate, updates, id } = this.state.task;
        const { isUsersShown, isStatusShown, isPriorityShown, isUpdatesShown, isTagsShown } = this.state

        return (
            <React.Fragment>
                {isUpdatesShown &&
                    <div className={`${isUpdatesShown && 'animate-side-modal'} side-modal`}>
                        <Updates task={this.state.task} updates={updates} members={members} priority={priority} status={status} dueDate={dueDate}
                            loggedUser={this.props.loggedUser} users={this.props.users}
                            sendNote={this.sendNote} handleChange={this.handleChange} handleDateChange={this.handleDateChange} onEditTags={this.onEditTags}
                            onEditTask={this.props.onEditTask} closeModal={this.closeModal}
                        />
                    </div>
                }


                {(isUsersShown || isStatusShown || isPriorityShown || isUpdatesShown || isTagsShown) && <div className="modal-screen-wrapper" onClick={this.closeModal}></div>}
                <Draggable draggableId={id} index={this.props.index}>
                    {(provided, snapshot) => (
                        <section key={id} className={`task flex space-between align-center ${snapshot.isDragging ? 'drag' : ''}`}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                        >

                            <div className="task-left flex align-center">
                                <div className="task-color-remove">
                                    <div style={{ backgroundColor: this.props.group.color }} className="task-color"></div>
                                    <div className='icon-container'>
                                        <MdDelete className="task-remove-icon" onClick={() => { this.props.onRemoveTask(id, this.props.group) }} />
                                    </div>

                                </div>
                                <div className="task-title-updates flex align-center space-between grow">
                                    <h2>
                                        <ContentEditable
                                            onFocus={this.focusText}
                                            className="cursor-initial content-editable"
                                            innerRef={this.contentEditable}
                                            html={name}
                                            disabled={false}
                                            onChange={this.handleNameChange}
                                            onBlur={() => {
                                                const desc = `${this.props.loggedUser.fullName} changed task name from ${this.state.task.name} to ${name} at group - ${this.props.group.name}`

                                                this.props.onEditTask(this.state.task, this.props.task, desc)
                                            }}
                                            onKeyDown={(ev) => {
                                                if (ev.key === 'Enter') {
                                                    ev.target.blur()
                                                }
                                            }}
                                        />
                                    </h2>


                                    <div onClick={() => this.openModal('updates')} className="notes-container relative grow"><BsChatDots />
                                        {(updates.length !== 0) && <div className="task-number-of-imgs flex justify-center align-center"><span>{updates.length}</span></div>}
                                    </div>
                                </div>
                            </div>

                            <div className="task-right flex align-center">
                                <Members members={members} users={this.props.users} isUsersShown={isUsersShown}
                                    openModal={this.openModal} goToUserProfile={this.goToUserProfile} onAddUserToTask={this.onAddUserToTask}
                                    onRemoveMemberFromTask={this.onRemoveMemberFromTask} />

                                <Status status={status} isStatusShown={isStatusShown}
                                    handleChange={this.handleChange} openModal={this.openModal} />

                                <Date dueDate={dueDate} handleDateChange={this.handleDateChange} />

                                <Priority priority={priority} isPriorityShown={isPriorityShown}
                                    openModal={this.openModal} handleChange={this.handleChange} />

                                <Tags handleChange={this.handleChange} onEditTags={this.onEditTags}
                                    task={this.state.task} isTagsShown={isTagsShown}
                                    openModal={this.openModal} handleChange={this.handleChange} />



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