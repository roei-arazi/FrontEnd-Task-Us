import React from 'react'
import { IoMdSend } from 'react-icons/io'
import { cloudinaryService } from '../../services/cloudinaryService';

export class Updates extends React.Component {

    state = {
        update: {
            txt: ''
        },
        updates: [],
    }

    componentDidMount() {
        this.setState({ updates: this.props.updates })
    }

    handleChange = (ev) => {
        this.setState({ update: { ...this.state.update, txt: ev.target.value } })
    }

    sendNote = (ev) => {
        ev.preventDefault()
        if (!this.state.update.txt || this.state.update.txt.split('').every(letter => letter === ' ')) return
        const newNote = {
            txt: this.state.update.txt,
            member: this.props.loggedUser.fullName
        }
        const updates = [newNote, ...this.props.updates]

        this.setState({ updates, update: { txt: '' } })

        this.props.sendNote(updates)
    }
    uploadImg = async (ev) => {
        const res = await cloudinaryService.uploadImg(ev, this.state)
        const newImg = {
            member: this.props.loggedUser.fullName,
            txt: res.url
        }
        const updates = [newImg, ...this.props.updates]
        this.props.sendNote(updates)

    }


    render() {
        if (!this.state.updates) return <h1>Loading...</h1>;

        const { updates, onToggleImageModal, isImageModalShown } = this.props
        return (
            <React.Fragment>
                <div className="updates-header flex column align-center">
                    <h1>Updates</h1>
                    <div className="updates-header-options flex align-center space-between">
                        <form onSubmit={this.sendNote} className="notes-form flex justify-center align-center">
                            <input type="text" placeholder="Text Note" value={this.state.update.txt} onChange={this.handleChange} />
                            <IoMdSend onClick={this.sendNote} />
                        </form>
                        <div className="image-uploader">
                            <label htmlFor="task-imgs">Upload Image</label>
                            {console.log('state <!!!!!></!!!!!>', this.state)}
                            <input type="file" id="task-imgs" onChange={(ev) => {
                                this.uploadImg(ev)
                            }} hidden />
                        </div>
                    </div>
                </div>

                <div onClick={isImageModalShown ? onToggleImageModal : () => { }} className="updates-container  flex column">

                    {updates.map((update, idx) => {

                        if (update.txt.includes('https://res') || update.txt.includes('http://res')) {
                            return <div key={idx} className="update-box flex wrap column">
                                <p className="member-name">{update.member}</p>
                                <img className="cursor-pointer" onClick={() => {
                                    onToggleImageModal(update.txt)
                                }} src={update.txt} />
                            </div>
                        } else return <div key={idx} className="update-box"><p className="member-name" key={idx}>{update.member}</p>
                            <p className="update-text">{update.txt}</p>
                        </div>
                    })}

                </div>

            </React.Fragment>

        )
    }
}