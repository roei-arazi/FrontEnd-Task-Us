import React, { Component } from 'react';
import { Task } from './Task'
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { ListItem, Menu, MenuItem, MenuList } from '@material-ui/core';
//Material ui
import { Tooltip, Zoom } from '@material-ui/core';
import { IoIosArrowDropdownCircle } from 'react-icons/io'
import { AiOutlineDelete } from 'react-icons/ai'

import ContentEditable from 'react-contenteditable';
import { CgColorPicker } from 'react-icons/cg';


export class Group extends Component {

    state = {
        id: '',
        ElGroupSettings: null,
        elGroupColors: false,
    }

    componentDidMount() {
        this.elInputAdd = React.createRef();
        this.contentEditable = React.createRef();
        this.setState({ ...this.state, ...this.props.group })
    }

    handleChange = (ev) => {
        this.setState({ name: ev.target.value });
    }

    focusText = () => {
        setTimeout(() => {
            document.execCommand('selectAll', false, null)
        }, 0)
    }

    handleMenuOpen = (ev) => {
        this.setState({ ElGroupSettings: ev.currentTarget })
    }

    handleMenuClose = () => {
        this.setState({ ElGroupSettings: null ,elGroupColors: false})
    }

    handleColorsOpen = (ev) => {
        console.log(this.state);
        this.setState({ elGroupColors: ev.currentTarget })
    }

    handleColorsToggle = () => {
        this.setState({ elGroupColors: !this.state.elGroupColors })
    }

    onChangeGroupColor = async (color) => {
        const newGroup = {
            ...this.props.group,
            color
        }
        try {
            await this.props.onEditGroup(newGroup, color, this.state.color)
        } catch (err) {
            console.log('Error', err)
        }
    }

    render() {
        if (!this.state.id) return <h1>Loading...</h1>
        const { name, ElGroupSettings, elGroupColors } = this.state;

        return (
            <Draggable draggableId={this.props.group.id} index={this.props.index}>
                {(provided, snapshot) =>
                    <section key={this.props.group.id} className="group padding-y-45"
                        {...provided.draggableProps}

                        ref={provided.innerRef}>
                        <div className="group-header-container flex space-between align-center" {...provided.dragHandleProps}>
                            <div className="group-header-left align-center flex relative">

                                <IoIosArrowDropdownCircle style={{ color: this.props.group.color }}
                                    className="drop-down-menu-icon" onClick={this.handleMenuOpen} />
                                <Menu
                                    role="menuContainer"
                                    anchorEl={ElGroupSettings}
                                    keepMounted
                                    open={Boolean(ElGroupSettings)}
                                    onClose={this.handleMenuClose}
                                >
                                    <MenuItem onClick={() => {
                                        this.props.onRemoveGroup(this.props.group.id)
                                    }}>
                                        <AiOutlineDelete /> Delete Group
                                    </MenuItem>
                                    <MenuItem onClick={this.handleColorsToggle}>
                                        <CgColorPicker /> Change Color
                                       
                                    </MenuItem>

                                </Menu>
                                {elGroupColors &&
                                            <div className="color-picker absolute flex wrap">                     
                                                    <div onClick={() => this.onChangeGroupColor('red')} className="color-pick" style={{ backgroundColor: 'red' }}></div>
                                                    <div onClick={() => this.onChangeGroupColor('green')} className="color-pick" style={{ backgroundColor: 'green' }}></div>
                                                    <div onClick={() => this.onChangeGroupColor('blue')} className="color-pick" style={{ backgroundColor: 'blue' }}></div>
                                                    <div onClick={() => this.onChangeGroupColor('yellow')} className="color-pick" style={{ backgroundColor: 'yellow' }}></div>
                                                    <div onClick={() => this.onChangeGroupColor('orange')} className="color-pick" style={{ backgroundColor: 'orange' }}></div>
                                                    <div onClick={() => this.onChangeGroupColor('black')} className="color-pick" style={{ backgroundColor: 'black' }}></div>
                                                    <div onClick={() => this.onChangeGroupColor('brown')} className="color-pick" style={{ backgroundColor: 'brown' }}></div>                                   
                                            </div>
                                        }

                                <h1 style={{ color: this.props.group.color }} className="group-title">
                                    <ContentEditable
                                        onFocus={this.focusText}
                                        className="content-editable cursor-initial"
                                        innerRef={this.contentEditable}
                                        html={name} // innerHTML of the editable div
                                        disabled={false}       // use true to disable editing
                                        onChange={this.handleChange} // handle innerHTML change
                                        onBlur={() => {
                                            this.props.onEditGroup(this.state, this.state.name, name)
                                        }}
                                        onKeyDown={(ev) => {
                                            if (ev.key === 'Enter') {
                                                ev.target.blur()
                                                this.props.onEditTask(this.state)
                                            }
                                        }}
                                    />
                                </h1>
                            </div>
                            <div className="group-header-right flex">

                                <h3>Updates</h3>
                                <h3>Members</h3>
                                <h3>Status</h3>
                                <h3>Due-Date</h3>
                                <h3>Priority</h3>
                            </div>
                        </div>

                        <Droppable droppableId={this.props.group.id} type="task">
                            {(provided, snapshot) =>
                                <div className={`task-list ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {this.props.group.tasks.map((task, index) => {
                                        return <Task onToggleUpdates={this.props.onToggleUpdates}
                                            onEditTask={this.props.onEditTask} index={index}
                                            onRemoveTask={this.props.onRemoveTask} key={task.id}
                                            group={this.props.group} task={task} users={this.props.users} />
                                    })}
                                    {provided.placeholder}

                                </div>
                            }
                        </Droppable>

                        <div className="task task-add">
                            <form onSubmit={(ev) => {
                                ev.preventDefault()
                                this.props.onAddTask(this.props.group.id, this.elInputAdd.current.value)
                                this.elInputAdd.current.value = ''
                            }} action="">
                                <input ref={this.elInputAdd} className="padding-x-30" placeholder="+ Add Task" type="text" />
                            </form>
                        </div>
                    </section>
                }
            </Draggable>
        )
    }

} 