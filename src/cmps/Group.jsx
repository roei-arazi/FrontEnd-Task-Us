import React, { Component } from 'react';
import { Task } from './Task'
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Menu, MenuItem } from '@material-ui/core';
//Material ui
import { IoIosArrowDropdownCircle } from 'react-icons/io'
import { AiOutlineDelete, AiOutlineDrag } from 'react-icons/ai'

import ContentEditable from 'react-contenteditable';
import { CgColorPicker } from 'react-icons/cg';
import socketService from '../services/socketService.js'


export class Group extends Component {

    state = {
        id: '',
        ElGroupSettings: null,
        elGroupColors: false,
    }

    reloadProps = () =>{
        this.setState({ ...this.state, name: this.props.group.name })
    }

    componentDidMount() {
        this.elInputAdd = React.createRef();
        this.contentEditable = React.createRef();
        socketService.on('updatedBoard', this.reloadProps)
        this.setState({ ...this.state, name: this.props.group.name, id: this.props.group.id })
    }

    componentWillUnmount(){
        socketService.off('updatedBoard', this.reloadProps)
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
        this.setState({ ElGroupSettings: null, elGroupColors: false })
    }

    handleColorsOpen = (ev) => {
        this.setState({ elGroupColors: ev.currentTarget })
    }

    handleColorsToggle = () => {
        this.setState({ elGroupColors: !this.state.elGroupColors })
    }

    onChangeGroupColor = (color) => {
        try {
            this.props.onEditGroup(this.props.group.id, color, 'color')
        } catch (err) {
            console.log('Error', err)
        }
        this.setState({ ElGroupSettings: null, elGroupColors: false })
    }

    convertToData(property) {
        const { tasks } = this.props.group;
        const taskCount = tasks.length;
        const percent = tasks.length / 100;
        const data = tasks.reduce((acc, task) => {
            const value = task[property]
            if(!acc[value]) acc[value] = 0;
            acc[value]++;
            return acc;
        }, {})
        const res = [];
        for (let key in data) {
            data[key] /= percent;
            res.push(<div key={key} style={{ width: data[key] ? `${data[key]}%` : '0' }}
                data-title={data[key] ? ` ${key} ${taskCount * data[key] / 100}/${taskCount} ${data[key].toFixed(1)}%` : ''}
                className={`precent-bar ${key.toLowerCase()}`}></div>)
        }
        return res;
    }

    render() {
        if (!this.state.id) return <h1>Loading...</h1> 
        const priority = this.convertToData('priority')
        const status = this.convertToData('status')
        const { name, ElGroupSettings, elGroupColors } = this.state;
        const { group, index } = this.props;
        return (
            <Draggable draggableId={group.id} index={index}>
                {(provided, snapshot) =>
                    <section key={group.id} className={`group ${window.innerWidth>450 ? 'padding-y-45' : 'padding-y-15'}`}
                        {...provided.draggableProps}

                        ref={provided.innerRef}>
                        <div className="group-header-container flex space-between align-center">
                            <div className="group-header-left align-center flex relative">

                                <IoIosArrowDropdownCircle style={{ color: group.color }}
                                    className="drop-down-menu-icon" onClick={this.handleMenuOpen} />
                                <Menu
                                    role="menuContainer"
                                    anchorEl={ElGroupSettings}
                                    keepMounted
                                    open={Boolean(ElGroupSettings)}
                                    onClose={this.handleMenuClose}
                                >
                                    <MenuItem onClick={() => {
                                        this.props.onRemoveGroup(group.id)
                                    }}>
                                        <AiOutlineDelete className="delete-group-icon" /> Delete Group
                                    </MenuItem>
                                    <MenuItem onClick={this.handleColorsToggle}>
                                        <CgColorPicker className="color-group-icon" /> Change Color

                                    </MenuItem>

                                </Menu>
                                {elGroupColors &&
                                    <div className="color-picker absolute flex wrap justify-center align-center">
                                        <div onClick={() => this.onChangeGroupColor('#ffcbcb')} className="color-pick" style={{ backgroundColor: '#ffcbcb' }}></div>
                                        <div onClick={() => this.onChangeGroupColor('#f0a500')} className="color-pick" style={{ backgroundColor: '#f0a500' }}></div>
                                        <div onClick={() => this.onChangeGroupColor('#70adb5')} className="color-pick" style={{ backgroundColor: '#70adb5' }}></div>
                                        <div onClick={() => this.onChangeGroupColor('#1a1c20')} className="color-pick" style={{ backgroundColor: '#1a1c20' }}></div>
                                        <div onClick={() => this.onChangeGroupColor('#9d65c9')} className="color-pick" style={{ backgroundColor: '#9d65c9' }}></div>
                                        <div onClick={() => this.onChangeGroupColor('#931a25')} className="color-pick" style={{ backgroundColor: '#931a25' }}></div>
                                        <div onClick={() => this.onChangeGroupColor('#7ea04d')} className="color-pick" style={{ backgroundColor: '#7ea04d' }}></div>
                                        <div onClick={() => this.onChangeGroupColor('#838383')} className="color-pick" style={{ backgroundColor: '#838383' }}></div>
                                        <div onClick={() => this.onChangeGroupColor('#1d2d50')} className="color-pick" style={{ backgroundColor: '#1d2d50' }}></div>
                                    </div>
                                }
                                {window.innerWidth>450 &&  <div className="drag-icon" {...provided.dragHandleProps}>
                                    <AiOutlineDrag />
                                </div>}
                               

                                <h1 style={{ color: group.color }} className="group-title">
                                    <ContentEditable
                                        onFocus={this.focusText}
                                        className="content-editable cursor-initial"
                                        innerRef={this.contentEditable}
                                        html={name} // innerHTML of the editable div
                                        disabled={false}       // use true to disable editing
                                        onChange={this.handleChange} // handle innerHTML change
                                        onBlur={() => {
                                            this.props.onEditGroup(group.id, this.state.name, 'name')
                                        }}
                                        onKeyDown={(ev) => {
                                            if (ev.key === 'Enter') {
                                                ev.target.blur()
                                                this.props.onEditGroup(group.id, this.state.name, 'name')
                                            }
                                        }}
                                    />
                                </h1>
                            </div>
                            <div className="group-header-right flex"  {...provided.dragHandleProps}>
                                <h3 style={{ color: this.props.group.color }}>Members</h3>
                                <h3 style={{ color: this.props.group.color }}>Status</h3>
                                {window.innerWidth > 450 &&
                                <h3 style={{ color: this.props.group.color }}>Due-Date</h3>}
                                {window.innerWidth > 450 &&
                                <h3 style={{ color: this.props.group.color }}>Priority</h3>}
                                {window.innerWidth > 450 &&
                                <h3 style={{ color: this.props.group.color }}>Tags</h3>}
                                
                                
                                
                            </div>
                        </div>

                        <Droppable droppableId={group.id} type="task">
                            {(provided, snapshot) =>
                                <div className={`task-list ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {group.tasks.map((task, index) => {
                                        return <Task onToggleUpdates={this.props.onToggleUpdates}
                                            onEditTask={this.props.onEditTask} index={index}
                                            onRemoveTask={this.props.onRemoveTask} key={task.id}
                                            group={group} task={task} users={this.props.users} />
                                    })}
                                    {provided.placeholder}

                                </div>
                            }
                        </Droppable>

                        <div className="task task-add">
                            <div className="task-color" style={{ backgroundColor: group.color }}></div>
                            <form onSubmit={(ev) => {
                                ev.preventDefault()
                                this.props.onAddTask(group.id, this.elInputAdd.current.value)
                                this.elInputAdd.current.value = ''
                            }} action="">
                                <input ref={this.elInputAdd} className="padding-x-30" placeholder="+ Add Task" type="text" />
                            </form>
                        </div>
                        {window.innerWidth > 450 && 
                       <section className="group-precent-container flex">
                       <div className="group-precent flex">
                           {status}
                       </div>
                       <div className="group-precent flex">
                           {priority}
                       </div>
                   </section>
                    }
                        
                    </section>
                }
            </Draggable>
        )
    }

} 