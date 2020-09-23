import React from 'react'

export class Update extends React.Component {

    state = {
        txt: ''
    }

    onReply = (newUpdate) => {
        if (!this.state.txt || this.state.txt.split('').every(letter => letter === ' ')) return
        console.log(this.props);
        const newReply = {
            txt: this.state.txt,
            createdAt: Date.now(),
            member: {
                fullName: this.props.loggedUser.fullName,
                username: this.props.loggedUser.userName,
                _id: this.props.loggedUser.userName,
                imgUrl: this.props.loggedUser.imgUrl
            }
        }
        const update = this.props.updates.find(update => update.id === newUpdate.id)
        update.replies = [...update.replies, newReply]
        this.props.updateNote(update)

        this.setState({ txt: '' })
    }

    handleChange = ({ target }) => {
        this.setState({ txt: target.value })
    }

    render() {
        const { update, idx } = this.props
        return (
            <div key={idx} className="update-box flex wrap column">
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
                                return <div key={idx} className="reply-box flex align-center">
                                    <img src={reply.member.imgUrl} alt="" />
                                    <p className="reply-name">{reply.member.fullName}</p>
                                    <p className="reply-text">{reply.txt}</p>
                                </div>
                            })}</div>
                    }
                    <div className="reply-footer flex space-between align-center">
                        <textarea value={this.state.txt} onChange={this.handleChange}></textarea>
                        <button className="reply-button" onClick={() => this.onReply(update)}>Reply</button>
                    </div>
                </div>
            </div>
        )
    }
}