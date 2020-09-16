import React, { Component } from 'react';
import ContentEditable from 'react-contenteditable'
import { Draggable } from 'react-beautiful-dnd'

export class Task extends Component {

    state = {
        id: ''
    }


    componentDidMount() {

        this.contentEditable = React.createRef();
        console.log('this.contentEditable', this.contentEditable)
        this.setState({ ...this.props.task }, console.log('STATE:', this.state))
    }


    handleChange = (ev) => {
        console.log('EV', ev.target)
        this.setState({ name: ev.target.value });
        console.log('STATE', this.state.name)
    }

    render() {
        if (!this.state.id) return <h1>Loading...</h1>
        console.log('STATE:', this.state)
        const elTaskName = this.state.name

        return (
            <Draggable draggableId={this.state.id} index={this.props.index}>
                {provided => (
                    <section className="task padding-y-15 padding-x-15 align-center"
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >

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

                        <button onClick={() => { this.props.onRemoveTask(this.state.id) }}>Remove task</button>
                    </section>
                )}
            </Draggable>
        )
    }

}