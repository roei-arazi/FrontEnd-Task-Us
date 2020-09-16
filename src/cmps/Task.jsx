import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd'

export class Task extends Component {

    state = {
        id: ''
    }

    componentDidMount() {
        this.setState({ ...this.props.task }, console.log('STATE:', this.state))
    }

    onSub = (ev) => {
        ev.preventDefault()
        this.props.onEditTask(this.state)
    }
    onCh = (ev) => {
        console.log('EV', ev.target)
        this.setState({ name: ev.target.value })
        console.log('STATE', this.state.name)
    }

    render() {
        if (!this.state.id) return <h1>Loading...</h1>
        return (
            <Draggable draggableId={this.state.id} index={this.props.index}>
                {provided => (
                    <section className="task padding-y-15 padding-x-15 align-center"
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        {/* <h1>task: {props.task.name}</h1> */}
                        <form onSubmit={this.onSub} action="">

                            <input onChange={this.onCh} name="name" type="text" />
                        </form>
                        <button onClick={() => { this.props.onRemoveTask(this.state.id) }}>Remove task</button>
                    </section>
                )}
            </Draggable>
        )
    }

}