import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { BiImage } from 'react-icons/bi';
import { MdDone } from 'react-icons/md';
// inside imports
import { cloudinaryService } from '../../services/cloudinaryService';
import { Update } from './Update';

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
        imageUploaded: false
    }
    componentDidMount() {
        this.setState({ imageUploaded: false })
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
    render() {
        if (!this.props.updates) return <h1>Loading...</h1>;
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
                <div className={`updates-container  ${!updates.length ? "flex justify-center align-center" : ""} `}>
                    {
                        !updates.length ? <h1>There are no posts to show.</h1> :
                            updates.map((update, idx) => <Update update={update} key={idx} idx={idx}
                                updates={updates} loggedUser={this.props.loggedUser}
                                sendNote={this.props.sendNote}
                                updateNote={this.updateNote} makeid={makeid} />)
                    }
                </div>
            </React.Fragment>
        )
    }
}
function makeid(length = 7) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}