import React, { Fragment } from 'react'
import { AiOutlineSend } from 'react-icons/ai';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';

export class Reply extends React.Component {
    state = {
        txt: '',
        isEditMode: false,
        isOptionsModal: false
    }
    handleChange = ({ target }) => {
        this.setState({ [target.name]: target.value })
    }
    toggleEditMode = (replyTxt) => {
        this.setState({ isEditMode: !this.state.isEditMode, txt: replyTxt })
    }
    updateReply = (newReply) => {
        if (newReply.txt === this.state.txt) return this.setState({ isEditMode: false })
        newReply.txt = this.state.txt
        const newReplies = this.props.update.replies.map(reply => {
            return reply.id === newReply.id ? newReply : reply
        })
        const update = { ...this.props.update, replies: newReplies }
        this.props.updateNote(update)
        this.setState({ isEditMode: false, txt: '' })
    }
    removeReply = (replyId) => {
        const idx = this.props.update.replies.findIndex(reply => reply.id === replyId)
        const newUpdate = { ...this.props.update }
        const update = newUpdate.replies.splice(idx, 1)
        this.props.updateNote(update)
    }
    toggleOptionsModal = () => {
        this.setState({ isOptionsModal: !this.state.isOptionsModal })
    }
    render() {
        const { reply, idx } = this.props
        return (
            <div key={idx} className="reply-box flex column relative">
                <HiOutlineDotsHorizontal className="options-reply-btn cursor-pointer" onClick={this.toggleOptionsModal} />
                <div className="reply-content flex align-center">
                    <img src={reply.member.imgUrl} alt="" />
                    <p className="reply-name">{reply.member.fullName}</p>
                    {!this.state.isEditMode ?
                        <p className="reply-text">{reply.txt}</p>
                        :
                        <div className="edit-box flex">
                            <textarea name="txt" onChange={this.handleChange} value={this.state.txt}></textarea>
                            <AiOutlineSend className="update-reply-btn" onClick={() => this.updateReply(reply)} />
                        </div>
                    }
                </div>
                {this.state.isOptionsModal &&
                    <Fragment>
                        <div onClick={() => {
                            this.toggleOptionsModal()
                        }} className="modal-screen-wrapper"></div>
                        <div className="update-options-modal">
                            <p className="remove-reply-btn  cursor-pointer" onClick={() => {
                                this.toggleOptionsModal()
                                this.removeReply(reply.id)
                            }}>Delete Post</p>
                            <p className="edit-reply-btn cursor-pointer" onClick={() => {
                                this.toggleOptionsModal()
                                this.toggleEditMode(reply.txt)
                            }}>Edit Post</p>
                        </div>
                    </Fragment>
                }
            </div>
        )
    }
}