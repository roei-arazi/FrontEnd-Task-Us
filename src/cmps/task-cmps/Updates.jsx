import React from 'react'
import { IoMdSend } from 'react-icons/io'

export class Updates extends React.Component {

    state = {
        isImagesShown: false,
        isNotesShown: false,
        update: {
            txt: ''
        },
        updates: [],
    }

    componentDidMount() {
        this.setState({ updates: this.props.updates })
    }

    toggleUpdates = (data) => {
        if (data === 'images') {
            this.setState({ isImagesShown: true })
            this.setState({ isNotesShown: false })
        } else {
            this.setState({ isImagesShown: false })
            this.setState({ isNotesShown: true })
        }
    }

    handleChange = (ev) => {
        this.setState({ update: { ...this.state.update, txt: ev.target.value } })
    }

    sendNote = async (ev) => {
        ev.preventDefault()
        if (!this.state.update.txt || this.state.update.txt.split('').every(letter => letter === ' ')) return
        const newNote = {
            txt: this.state.update.txt,
            member: this.props.loggedUser.fullName
        }
        const updates = [newNote, ...this.props.updates]

        await this.setState({ updates, update: { txt: '' } })

        this.props.sendNote(updates)
    }

    render() {
        if (!this.state.updates) return <h1>Loading...</h1>;

        const { updates } = this.props
        return (
            <React.Fragment>
                <div className="updates-header flex column align-center">
                    <h1>Updates</h1>
                    <div className="updates-header-options flex align-center space-between">  
                    <div className="image-uploader">
                        <label htmlFor="task-imgs">Upload Image</label>
                        <input type="file" id="task-imgs" onChange={this.props.uploadImg} hidden />
                    </div>
                    <form onSubmit={this.sendNote} className="notes-form flex justify-center align-center">
                        <input type="text" placeholder="Text Note" value={this.state.update.txt} onChange={this.handleChange} />
                        <IoMdSend onClick={this.sendNote}/>
                    </form>
                    </div>
                </div>

                <div className="updates-container flex column">

                    {updates.map((update, idx) => {
                        console.log(update.txt);
                        if (update.txt.includes('https://res') || update.txt.includes('http://res')) {
                        return <div key={idx} className="update-box flex wrap column"><p className="member-name">{update.member} :</p> <img src={update.txt} /></div>
                    }else return <div className="update-box"><p className="member-name" key={idx}>{update.member}: <p class="update-text">{update.txt}</p></p></div>
                    })}
                </div>
            </React.Fragment>

        )
    }
}