import React from 'react'
import { IoMdImages } from 'react-icons/io'
import { CgNotes } from 'react-icons/cg'

export class Updates extends React.Component {

    state = {
        isImagesShown: true,
        isNotesShown: false,
        note:{
            txt:''
        },
    }

    componentDidMount(){
        this.setState({notes: this.props.notes})
    }

    toggleUpdates = (data) => {
        if (data === 'images') {
            this.setState({isImagesShown: true})
            this.setState({isNotesShown: false})
        } else {
            this.setState({isImagesShown: false})
            this.setState({isNotesShown: true})
        }
    }

    handleChange =(ev)=>{
        this.setState({note:{...this.state.note, txt: ev.target.value}})
    }

    sendNote =async (ev)=>{
        ev.preventDefault()
        const notes= JSON.parse(JSON.stringify(this.state.notes))
        if(!this.state.note.txt || this.state.note.txt.split('').every(letter=> letter===' '))return
        const newNote={
            txt: this.state.note.txt,
            member: this.props.loggedUser.fullName
        }
        notes.push(newNote)
        await this.setState({notes, note:{txt:''}})    
        
        this.props.sendNote(this.state.notes)
    }

    render() {
        const { attachedImgs } = this.props
        const {notes} = this.state
        return (
            <React.Fragment>


                <div className="updates-header flex column align-center">
                    <h1>Updates</h1>
                    <div className="updates-icons flex align-center">
                        <IoMdImages onClick={()=>this.toggleUpdates('images')} />
                        <CgNotes onClick={()=>this.toggleUpdates('notes')} />
                    </div>
                </div>
                {this.state.isImagesShown &&
                    <div className="updates-images flex column align-center">
                        <div className="image-uploader">
                            <label htmlFor="task-imgs">Upload Image</label>
                        <input type="file" id="task-imgs" onChange={this.props.uploadImg} hidden />           
                     </div>
                        <div className="image-list flex wrap">
                        {attachedImgs.map((imgUrl, idx) => <div key={idx} className="updates-image"><img src={imgUrl} /></div>)}
                        </div>
                    </div>
                }

                {this.state.isNotesShown &&
                    <div className="updates-notes flex column">
                        <form onSubmit={this.sendNote} className="notes-form flex column justify-center align-center">
                        <input type="text" value={this.state.note.txt} onChange={this.handleChange} />
                        <button>Send</button>
                        </form>
                        <div className="notes-messages">
                        {notes.map((note, idx) => <p className="note-text" key={idx}>{note.member}: {note.txt}</p>)}
                        </div>
                    </div>
                }
           </React.Fragment>

        )
    }
}