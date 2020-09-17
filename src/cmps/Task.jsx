import React, { Component } from 'react';
import ContentEditable from 'react-contenteditable'
import { Draggable } from 'react-beautiful-dnd'
//Material ui
import { Tooltip, Zoom } from '@material-ui/core';
import { MdDeleteSweep } from 'react-icons/md'

export class Task extends Component {

    state = {
        id: ''
    }


    componentDidMount() {
        this.contentEditable = React.createRef();
        this.setState({ ...this.props.task })
    }


    handleChange = (ev) => {
        this.setState({ name: ev.target.value });
    }

    render() {
        if (!this.state.id) return <h1>Loading...</h1>
        const elTaskName = this.state.name
        return (
            <Draggable draggableId={this.state.id} index={this.props.index}>
                {(provided, snapshot) => (
                    <section key={this.props.task.id} className={`task padding-y-15 padding-x-15 align-center ${snapshot.isDragging ? 'drag' : ''}`}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >

                        <Tooltip enterDelay={200} TransitionComponent={Zoom} title="Delete Task" arrow>
                            <div className='icon-container'>
                                <MdDeleteSweep onClick={() => { this.props.onRemoveTask(this.state.id) }} />
                            </div>
                        </Tooltip>

                        <ContentEditable
                            className="cursor-initial"
                            innerRef={this.contentEditable}
                            html={elTaskName} // innerHTML of the editable div
                            disabled={false}       // use true to disable editing
                            onChange={this.handleChange} // handle innerHTML change
                            onBlur={() => {
                                this.props.onEditTask(this.state)
                            }}
                        />

                    </section>
                )}
            </Draggable>
        )
    }
}