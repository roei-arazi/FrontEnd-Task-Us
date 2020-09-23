import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { BiImage } from 'react-icons/bi';
import { MdDone } from 'react-icons/md';

import { cloudinaryService } from '../../services/cloudinaryService';


function _makeid(length = 7) {
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
        updates: [],
        isLoading: false,
        imageUploaded: false
    }

    componentDidMount() {
        this.setState({ updates: this.props.updates, imageUploaded: false })
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

    onReply = (newUpdate) => {
        if (!this.state.reply.txt || this.state.reply.txt.split('').every(letter => letter === ' ')) return

        const newReply = {
            txt: this.state.reply.txt,
            member: {
                fullName: this.props.loggedUser.fullName,
                username: this.props.loggedUser.userName,
                _id: this.props.loggedUser.userName,
                imgUrl: this.props.loggedUser.imgUrl
            }
        }
        this.setState({ update: this.state.updates.find(update => update.id === newUpdate.id) }, () => {
            this.setState({ update: { ...this.state.update, replies: [...this.state.update.replies, newReply] } }, () => {
                this.updateNote(this.state.update)
            })
        })
        this.setState({reply: { txt: ''} })
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
            id: _makeid(),
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
        this.setState({ updates, update: { txt: '', imgUrl: '' } })
        this.props.sendNote(updates)
    }

    updateNote = (newUpdate) => {
        const newNotes = this.state.updates.map(update => update.id === newUpdate.id ? newUpdate : update)
        this.props.sendNote(newNotes)
    }


    render() {
        if (!this.state.updates) return <h1>Loading...</h1>;
        console.log(this.state.updates);
        const { updates } = this.props
        return (
            <React.Fragment>
                <div className="updates-header flex column">
                    <AiOutlineClose onClick={this.props.closeModal} />
                    <h1>{this.props.task.name}</h1>
                    <div className="updates-header-options flex column">
                        <form onSubmit={this.sendNote} className="notes-form flex align-center">
                            <textarea name="txt" value={this.state.update.txt} onChange={this.handleChange} />


                        </form>
                        <div className="updates-btns flex align-center space-between">

                            <div className="image-uploader flex">
                                <label htmlFor={this.props.task.id}>{this.state.isLoading ? <div class="loadingio-spinner-spinner-gvjl1rpqs7q"><div class="ldio-subadnemdcd">
                                    <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
                                </div></div> : <BiImage />}
                                </label>
                                <input name="file-img" type="file" id={this.props.task.id} onChange={(this.handleChange)} hidden />
                                {this.state.imageUploaded && <div className="image-uploaded flex align-center"><MdDone /><p> Image Ready!</p></div>}
                            </div>
                            {this.state.isLoading ? <p>Image is uploading..</p> : <button onClick={this.sendNote}>Upload</button>}

                        </div>
                    </div>
                </div>

                <div className="updates-container">

                    {updates.map((update, idx) => {
                        return <div key={idx} className="update-box flex wrap column">
                            <div className="update-box-header flex align-center">
                                <img src={update.member.imgUrl} alt="" />
                                <p className="member-name">{update.member.fullName}</p>
                            </div>
                            <div className="update-box-main flex column">
                                {update.txt && <p className="update-text">{update.txt}</p>}
                                {update.imgUrl && <img src={update.imgUrl} alt="" />}
                            </div>
                            <div className="update-box-footer flex column">

                                {update.replies &&
                                    <div className="replies-box flex column">
                                        {update.replies.map((reply, idx) => {
                                            return <div key={idx} className="reply-box flex column">
                                                <div className="reply-header flex align-center">
                                                    <img src={reply.member.imgUrl} alt="" />
                                                    <p>{reply.member.fullName}</p>
                                                </div>
                                                <p>{reply.txt}</p>
                                            </div>
                                        })}</div>
                                }
                                <div className="reply-footer flex space-between align-center">
                                <textarea name="reply" onChange={this.handleChange}></textarea>
                                <button className="reply-button" onClick={() => this.onReply(update)}>Reply</button>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </React.Fragment>

        )
    }
}