import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { Boardbar } from '../cmps/Boardbar';
import { BoardHeader } from '../cmps/BoardHeader';
import { Navbar } from '../cmps/Navbar';
import { Group } from '../cmps/Group';
import { Popup } from '../cmps/Popup'
import { showSnackbar, hideSnackbar } from '../store/actions/systemActions.js';
// Reducers funcs
import { loadUsers } from '../store/actions/userActions'
import {
    updateBoard, loadBoards,   //BOARD
    addGroup, editGroup, removeGroup, //GROUP
    addTask, removeTask, editTask  //TASK
}
    from '../store/actions/boardActions'

class _Board extends Component {

    state = {
        boardId: '',
    }

    async componentDidMount() {
        try {
            if (!this.props.boards || !this.props.boards.length) {
                await this.props.loadBoards();
                try {
                    if (!this.props.users || !this.props.users.length) {
                        await this.props.loadUsers();
                    }
                } catch (err) {
                    console.log('Error', err)
                }
            }
        } catch (err) {
            console.log('Error', err)
        }
        this.setState({ boardId: this.props.match.params.id })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            console.log('changing to:', this.props.match.params.id);
            this.setState({ boardId: this.props.match.params.id })
        }
    }

    onEditBoard = (boardName, boardDescription) => {
        console.log(boardName);
        const board = this.props.boards.find(board => board._id === this.state.boardId)
        this.props.updateBoard({ ...board, name: boardName, description: boardDescription })
    }

    //------------------GROUP CRUD-----------------
    onAddGroup = async () => {
        try {
            await this.props.addGroup(this.state.boardId)
            await this.props.showSnackbar('Added group.');
            setTimeout(() => this.props.hideSnackbar(), 3000)
        } catch (err) {
            console.log('Error', err)
        }
    }
    onRemoveGroup = async (groupId) => {
        try {
            await this.props.removeGroup(groupId)
            await this.props.showSnackbar('Removed group.');
            setTimeout(() => this.props.hideSnackbar(), 3000)
        } catch (err) {
            console.log('Error', err)
        }
    }
    onEditGroup = async (group, changedValue, originalValue) => {

        if (changedValue === originalValue) return // No changes were made

        try {
            await this.props.editGroup(group)
            await this.props.showSnackbar('Updated group.');
            setTimeout(() => this.props.hideSnackbar(), 3000)
        } catch (err) {
            console.log('Error', err)
        }
    }

    //-----------------TASKS CRUD------------------------
    onRemoveTask = async (taskId) => {
        try {
            await this.props.removeTask(taskId)
            await this.props.showSnackbar('Removed task.');
            setTimeout(() => this.props.hideSnackbar(), 3000)
        } catch (err) {
            console.log('Error', err)
        }
    }
    onAddTask = async (groupId) => {
        try {
            await this.props.addTask(groupId)
            await this.props.showSnackbar('Added task.');
            setTimeout(() => this.props.hideSnackbar(), 3000)
        } catch (err) {
            console.log('Error', err)
        }
    }
    onEditTask = async (task) => {
        try {
            await this.props.editTask(task)
            await this.props.showSnackbar('Updated task.');
            setTimeout(() => this.props.hideSnackbar(), 3000)
        } catch (err) {
            console.log('Error', err)
        }
    }
    //---------------------Draggable----------------------

    onDragEnd = async result => {
        const { destination, source, draggableId, type } = result
        if (!destination) return;
        if (destination.droppableId === source.droppableId
            &&
            destination.index === source.index) return;

        const board = this.props.boards.find(board => board._id === this.state.boardId)

        if (type === 'group') {
            const newGroups = Array.from(board.groups)
            const draggedGroup = newGroups.find(group => group.id === draggableId)
            newGroups.splice(source.index, 1)
            newGroups.splice(destination.index, 0, draggedGroup)
            board.groups = newGroups
            try {
                await this.props.updateBoard(board)
            } catch (err) {
                console.log('Error', err);
            }
        } else {
            const groupStart = board.groups.find(group => group.id === source.droppableId)
            const groupEnd = board.groups.find(group => group.id === destination.droppableId)

            if (groupStart.id === groupEnd.id) {

                const newTasks = Array.from(groupStart.tasks)
                const newTask = groupStart.tasks.find(task => task.id === draggableId)

                newTasks.splice(source.index, 1)
                newTasks.splice(destination.index, 0, newTask)

                const newGroup = {
                    ...groupStart,
                    tasks: newTasks
                }
                const newIdx = board.groups.findIndex(group => group.id === newGroup.id)
                board.groups.splice(newIdx, 1, newGroup)
                try {
                    await this.props.updateBoard(board)

                } catch (err) {
                    console.log('Error', err);
                }
            } else {

                const startTasks = Array.from(groupStart.tasks)
                startTasks.splice(source.index, 1)
                const newStartGroup = {
                    ...groupStart,
                    tasks: startTasks
                }
                const endTasks = Array.from(groupEnd.tasks)
                const newTaskToPaste = groupStart.tasks.find(task => task.id === draggableId)
                endTasks.splice(destination.index, 0, newTaskToPaste)
                const newFinishGroup = {
                    ...groupEnd,
                    tasks: endTasks
                }

                const startIdx = board.groups.findIndex(group => group.id === newStartGroup.id)
                const endIdx = board.groups.findIndex(group => group.id === newFinishGroup.id)

                board.groups.splice(startIdx, 1, newStartGroup)
                board.groups.splice(endIdx, 1, newFinishGroup)
                try {
                    this.props.updateBoard(board)
                } catch (err) {
                    console.log('Error', err);
                }
            }
        }
    }
    render() {
        const board = this.props.boards.find(board => board._id === this.state.boardId)
        const users = this.props.users
        if (!board) return <h1>Loading..</h1>
        board.members = users
        console.log('rendering board:', board);
        return (
            <section className="board">
                <Navbar />
                <Boardbar />
                <div className="board-container">
                    <BoardHeader board={board} onAddGroup={this.onAddGroup} onEditBoard={this.onEditBoard} />
                    <div className="groups-container padding-x-30">
                        <DragDropContext
                            onDragEnd={this.onDragEnd}
                        >
                            <Droppable droppableId={board._id} type="group">
                                {(provided, snapshot) =>
                                    <div className={`group-list`}
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}>
                                        {board.groups.map((group, index) => {
                                            return <Group key={group.id} index={index}
                                                onEditTask={this.onEditTask} onAddTask={this.onAddTask} onRemoveTask={this.onRemoveTask}
                                                onRemoveGroup={this.onRemoveGroup} onEditGroup={this.onEditGroup} group={group} users={users} />
                                        })}
                                    </div>
                                }
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
                <Popup />
            </section>
        )
    }
}

const mapStateToProps = state => {
    return {
        boards: state.boardReducer.boards,
        users: state.userReducer.users
    }
}

const mapDispatchToProps = {
    loadBoards,
    addGroup,
    removeGroup,
    addTask,
    removeTask,
    editTask,
    editGroup,
    updateBoard,
    showSnackbar,
    hideSnackbar,
    loadUsers
}

export const Board = connect(mapStateToProps, mapDispatchToProps)(_Board);