import React from 'react'
import { AiOutlineSend } from 'react-icons/ai';


export class Reply extends React.Component{
    state={
        txt:'',
        isEditMode: false
    }

    handleChange = ({ target }) => {
        this.setState({ [target.name]: target.value })
    }

    toggleEditMode =(replyTxt)=>{
        this.setState({isEditMode: !this.state.isEditMode, txt:replyTxt})
    }
       
    updateReply= (newReply)=>{
        if(newReply.txt===this.state.txt) return this.setState({isEditMode: false})
        newReply.txt= this.state.txt
        const newReplies= this.props.update.replies.map(reply=>{
            return reply.id===newReply.id ? newReply : reply
        } )

        const update= {...this.props.update,replies:newReplies}
        this.props.updateNote(update)
        this.setState({isEditMode: false, txt: ''})
    }

    removeReply= (replyId)=>{
        const idx= this.props.update.replies.findIndex(reply=> reply.id===replyId)
        const newUpdate= {...this.props.update}
        const update=newUpdate.replies.splice(idx, 1)
        this.props.updateNote(update)
    }


    render(){
        const {reply, idx}= this.props
        return(
            <div key={idx} className="reply-box flex column relative">
            <button className="remove-reply-btn absolute" onClick={()=>this.removeReply(reply.id)}>X</button>
            <div className="reply-content flex align-center">
            <img src={reply.member.imgUrl} alt="" />
            <p className="reply-name">{reply.member.fullName}</p>
            {!this.state.isEditMode ?
            <p className="reply-text">{reply.txt}</p> 
            :    
            <div className="edit-box flex">
            <textarea name="txt" onChange={this.handleChange} value={this.state.txt}></textarea>
            <AiOutlineSend className="update-reply-btn" onClick={()=>this.updateReply(reply)} />
            </div>
            }
            </div>
            <p className="edit-reply-btn" onClick={()=>this.toggleEditMode(reply.txt)}>Edit</p>
        </div>
        )
    }
}