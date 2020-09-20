import React from 'react'
import { IoMdImages } from 'react-icons/io'
import { CgNotes } from 'react-icons/cg'

export class Updates extends React.Component {

    state = {
        isImagesShown: false,
        isNotesShown: false,
        update: {
            txt: ''
        },
        updates:[],
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
        const updates = JSON.parse(JSON.stringify(this.state.updates))
        if (!this.state.update.txt || this.state.update.txt.split('').every(letter => letter === ' ')) return
        const newNote = {
            txt: this.state.update.txt,
            member: this.props.loggedUser.fullName
        }
        updates.push(newNote)
        await this.setState({ updates, update: { txt: '' } })

        this.props.sendNote(this.state.updates)
    }

    render() {
        if(!this.state.updates) return <h1>Loading...</h1>;
        const { attachedImgs } = this.props
        const { updates } = this.props
        return (
            <React.Fragment>
                <div className=" updates-header flex column align-center">
                    <h1>Updates</h1>
                    <div className="updates-icons flex align-center">
                        <IoMdImages onClick={() => this.toggleUpdates('images')} />
                        <CgNotes onClick={() => this.toggleUpdates('updates')} />
                    </div>
                </div>
                {/* {this.state.isImagesShown &&
                    <div className="updates-images flex column align-center">
                        <div className="image-uploader">
                            <label htmlFor="task-imgs">Upload Image</label>
                            <input type="file" id="task-imgs" onChange={this.props.uploadImg} hidden />
                        </div>
                        <div className="image-list">
                            {attachedImgs.map((imgUrl, idx) => <div key={idx} className="updates-image"><img src={imgUrl} /></div>)}
                        </div>
                    </div>
                }

                {this.state.isNotesShown &&
                    <div className="updates-notes flex column">
                        <form onSubmit={this.sendNote} className="notes-form flex column justify-center align-center">
                            <input type="text" value={this.state.update.txt} onChange={this.handleChange} />
                            <button>Send</button>
                        </form>
                        <div className="notes-messages">
                            {updates.map((update, idx) => <p className="update-text" key={idx}>{update.member}: {update.txt}</p>)}
                        </div>
                    </div>
                } */}

                <div className="updates-container flex column">
                    {updates.map((update,idx)=>{
                        if(update.txt.includes('https://res')) return <div key={idx} className="update-box">{update.member}: <img src={update.txt} /></div>
                        else return <div className="update-box"><p className="update-text" key={idx}>{update.member}: {update.txt}</p></div>
                    })}
                </div>
            </React.Fragment>

        )
    }
}