import React, { Component } from 'react';
import { Task } from './Task'
import { Droppable } from 'react-beautiful-dnd';
import ContentEditable from 'react-contenteditable';

export class Group extends Component {

    state = {
        id: ''
    }

    componentDidMount() {
        this.contentEditable = React.createRef();
        this.setState({ ...this.props.group })
    }

    handleChange = (ev) => {
        console.log('EV', ev.target)
        this.setState({ name: ev.target.value });
        console.log('STATE', this.state.name)
    }

    render() {
        if (!this.state.id) return <h1>Loading...</h1>
        const elGroupName = this.state.name

        return (
            <section key={this.props.group.id} className="group">
                <div className="group-header-container padding-y-15">
                    <h1>
                        <ContentEditable
                            className="cursor-initial"
                            innerRef={this.contentEditable}
                            html={elGroupName} // innerHTML of the editable div
                            disabled={false}       // use true to disable editing
                            onChange={this.handleChange} // handle innerHTML change
                            onBlur={() => {
                                this.props.onEditGroup(this.state, this.state.name, elGroupName)
                            }}
                        />
                    </h1>
                    <button onClick={() => {
                        this.props.onRemoveGroup(this.props.group.id)
                    }}>Delete Group</button>
                </div>
                <Droppable droppableId={this.props.group.id}>
                    {(provided, snapshot) =>
                        <div className={`task-list ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {this.props.group.tasks.map((task, index) => {
                                return <Task onEditTask={this.props.onEditTask} index={index} onRemoveTask={this.props.onRemoveTask} key={task.id} task={task} />
                            })}
                            {provided.placeholder}
                        </div>
                    }
                </Droppable>
                <button onClick={() => {
                    this.props.onAddTask(this.props.group.id)
                }}>Add New Task</button>
            </section>
        )
    }

}