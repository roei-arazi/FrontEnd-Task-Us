import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { BiImage } from 'react-icons/bi';
import { MdDone } from 'react-icons/md';

import { cloudinaryService } from '../../services/cloudinaryService';
import { Priority } from './Priority';
import { Status } from './Status';
import { Tags } from './Tags';
import { Update } from './Update';
import { Date } from './Date';
import { Members } from './Members';


function makeid(length = 7) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

export class Updates extends React.Component {

    state = {
        reply: {
            txt: ''
        },
        update: {
            id: '',
            txt: '',
            imgUrl: '',
            replies: []
        },
        isLoading: false,
        imageUploaded: false,
        isColumnsShown: false,
        isUpdatesShown: true,
        isStatusShown: false,
        isPriorityShown: false,
        isUsersShown: false,
        isTagsShown: false
    }

    componentDidMount() {
        this.setState({ imageUploaded: false, task: this.props.task })
    }

    handleChange = (ev) => {
        if (ev.target.name === 'file-img') {
            this.setState({ update: { ...this.state.update, img: ev.target.files[0] } }, () => {
                this.uploadImg()
            })
        } else if (ev.target.name === 'txt') {
            this.setState({ update: { ...this.state.update, txt: ev.target.value } })
        } else {
            this.setState({ reply: { ...this.state.reply, txt: ev.target.value } })
        }
    }

    uploadImg = async () => {
        this.setState({ isLoading: true })
        const res = await cloudinaryService.uploadImg(this.state.update.img, this.state)
        this.setState({ update: { ...this.state.update, imgUrl: res.url }, isLoading: false, imageUploaded: true })
    }

    sendNote = (ev) => {
        ev.preventDefault()
        if ((!this.state.update.txt || this.state.update.txt.split('').every(letter => letter === ' ')) && !this.state.update.imgUrl) return
        const newNote = {
            id: makeid(),
            createdAt: Date.now(),
            txt: this.state.update.txt,
            imgUrl: this.state.update.imgUrl,
            replies: [],
            member: {
                fullName: this.props.loggedUser.fullName,
                username: this.props.loggedUser.userName,
                _id: this.props.loggedUser.userName,
                imgUrl: this.props.loggedUser.imgUrl
            }
        }
        const updates = [newNote, ...this.props.updates]
        this.setState({ update: { txt: '', imgUrl: '' }, imageUploaded: false })
        this.props.sendNote(updates)
    }

    updateNote = (newUpdate) => {
        const newNotes = [...this.props.updates].map(update => update.id === newUpdate.id ? newUpdate : update)
        this.props.sendNote(newNotes)
    }

    showUpdates = () => {
        this.setState({ isUpdatesShown: true })
        this.setState({ isColumnsShown: false })
    }
    showColumns = () => {
        this.setState({ isColumnsShown: true })
        this.setState({ isUpdatesShown: false })
    }


    openModal = (data) => {
        switch (data) {
            case 'status':
                this.setState({ isStatusShown: true })
                break;
            case 'users':
                this.setState({ isUsersShown: true })
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
        this.setState({ isImageModalShown: false, isStatusShown: false, isUsersShown: false, isPriorityShown: false, isTagsShown: false })
    }

    onRemoveMemberFromTask = (memberId) => {
        const removedMember = this.state.task.members.find(member => member._id === memberId)
        this.setState({ task: { ...this.state.task, members: this.state.task.members.filter(member => member._id !== memberId) } }, () => {
            this.props.onEditTask(this.state.task, this.props.group, removedMember, false, 'removeFromTask')
        })
    }

    onAddUserToTask = (userId) => {
        const newUser = this.props.users.find(user => user._id === userId)
        this.setState({ task: { ...this.state.task, members: [...this.state.task.members, newUser] } }, () => {
            this.props.onEditTask(this.state.task, this.props.group, newUser, false, 'addToTask')
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
        this.setState({ ...this.state, task: { ...this.state.task, tags: JSON.parse(JSON.stringify(tags)) } }, () => {
            this.props.onEditTask(this.state.task, this.props.group, tagName, false, type)
        })
    }

    render() {
        if (!this.props.updates || !this.state.task) return <h1>Loading...</h1>;
        const { isUsersShown, isStatusShown, isPriorityShown, isTagsShown } = this.state
        const { updates } = this.props
        return (
            <React.Fragment>
                <div className="updates-header flex column">
                    <AiOutlineClose onClick={this.props.closeModal} />
                    <h1>{this.props.task.name}</h1>
                    {window.innerWidth < 450 &&
                        <div className="mobile-options flex justify-center">
                            <h3 onClick={this.showUpdates}>Posts</h3> |
                        <h3 onClick={this.showColumns}>Columns</h3>
                        </div>}
                    <div className="updates-header-options flex column">
                        <form onSubmit={this.sendNote} className="notes-form flex align-center">
                            <textarea name="txt" value={this.state.update.txt} onChange={this.handleChange} />
                        </form>

                        <div className="updates-btns flex align-center space-between">
                            <div className="image-uploader flex">
                                <label data-title="Upload Image" htmlFor={this.props.task.id}>{this.state.isLoading ? <div class="loadingio-spinner-spinner-gvjl1rpqs7q"><div class="ldio-subadnemdcd">
                                    <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
                                </div></div> : <BiImage />}
                                </label>
                                <input name="file-img" type="file" id={this.props.task.id} onChange={(this.handleChange)} hidden />
                                {this.state.imageUploaded && <div className="image-uploaded flex align-center"><MdDone /><p> Image Ready!</p></div>}
                            </div>
                            {this.state.isLoading ? <p>Image is uploading..</p> : <button onClick={this.sendNote}>Send</button>}

                        </div>
                    </div>
                </div>
                {this.state.isUpdatesShown && <div className="updates-container">
                    {updates.map((update, idx) => <Update update={update} key={idx} idx={idx}
                        updates={updates} loggedUser={this.props.loggedUser}
                        sendNote={this.props.sendNote}
                        updateNote={this.updateNote} makeid={makeid} />)}
                </div>}
                {(isUsersShown || isStatusShown || isPriorityShown || isTagsShown) && <div className="modal-screen-wrapper" onClick={this.closeModal}></div>}

                {this.state.isColumnsShown && <div className="columns-container">
                    <div className="title-column">
                    </div>
                    <div className="title-column">
                    <p>Title: {this.state.task.name}</p><p></p>
                    </div>
                    <div className="title-column">
                        <p>Members:</p><Members members={this.props.members} users={this.props.users} isUsersShown={this.state.isUsersShown}
                            openModal={this.openModal} goToUserProfile={this.goToUserProfile} onAddUserToTask={this.onAddUserToTask}
                            onRemoveMemberFromTask={this.onRemoveMemberFromTask} />
                    </div>
                    <div className="title-column">
                        <p>Status:</p> <Status status={this.props.status} isStatusShown={this.state.isStatusShown}
                            handleChange={this.props.handleChange} openModal={this.openModal} />
                    </div>
                    <div className="title-column">
                        <p>Due-Date:</p> <Date dueDate={this.props.dueDate} handleDateChange={this.props.handleDateChange} />
                    </div>
                    <div className="title-column">
                        <p>Priority:</p><Priority priority={this.props.priority} isPriorityShown={this.state.isPriorityShown}
                            openModal={this.openModal} handleChange={this.props.handleChange} />
                    </div>
                    <div className="tags-column">
                        <p>Tags:</p> <Tags handleChange={this.props.handleChange} onEditTags={this.onEditTags}
                            task={this.props.task} isTagsShown={this.state.isTagsShown}
                            openModal={this.openModal} handleChange={this.props.handleChange} />
                    </div>
                </div>}









            </React.Fragment>

        )
    }
}