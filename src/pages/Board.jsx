import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { Boardbar } from '../cmps/Boardbar';
import { BoardHeader } from '../cmps/BoardHeader';
import { Navbar } from '../cmps/Navbar';
import { Group } from '../cmps/Group';
// Reducers funcs
import { updateBoard, loadBoards, addGroup, editGroup, removeGroup, addTask, removeTask, editTask } from '../store/actions/boardActions'

class _Board extends Component {

    boardId = '123'

    async componentDidMount() {

        //TODO: change loadBoard argument to this.props.match.params.id

        try {
            console.log('this.props.boards', this.props.boards)
            if (!this.props.boards || !this.props.boards.length) {
                await this.props.loadBoards()
                return
            }
        } catch (err) {
            console.log('Error', err)
        }

    }

    //------------------GROUP CRUD-----------------
    onAddGroup = async () => {
        try {
            await this.props.addGroup(this.boardId)
        } catch (err) {
            console.log('Error', err)
        }
    }
    onRemoveGroup = async (groupId) => {
        console.log('Removing group, group id:', groupId)
        try {
            await this.props.removeGroup(groupId)
        } catch (err) {
            console.log('Error', err)
        }
    }
    onEditGroup = async (group) => {
        console.log('Editing group, group:', group)
        try {
            await this.props.editGroup(group)
        } catch (err) {
            console.log('Error', err)
        }
    }

    //-----------------TASKS CRUD------------------------
    onRemoveTask = async (taskId) => {
        console.log('Removing task, task id:', taskId)
        try {
            await this.props.removeTask(taskId)
        } catch (err) {
            console.log('Error', err)
        }
    }
    onAddTask = async (groupId) => {
        console.log('Adding task, task id:', groupId)
        try {
            await this.props.addTask(groupId)
        } catch (err) {
            console.log('Error', err)
        }
    }
    onEditTask = async (task) => {
        console.log('Editing task, got task:', task)
        try {
            await this.props.editTask(task)
        } catch (err) {
            console.log('Error', err)
        }
    }
    //---------------------Draggable----------------------

    onDragEnd = async result => {
        const { destination, source, draggableId } = result
        if (!destination) return;
        if (destination.droppableId === source.droppableId
            &&
            destination.index === source.index) return;

        const board = this.props.boards.find(board => board._id === this.boardId)
        const group = board.groups.find(group => group.id === source.droppableId)
        const newTasks = Array.from(group.tasks)

        const newTask = group.tasks.find(task => task.id === draggableId)

        newTasks.splice(source.index, 1)
        newTasks.splice(destination.index, 0, newTask)

        const newGroup = {
            ...group,
            tasks: newTasks
        }
        console.log(newGroup);
        try {
            await this.props.updateBoard(newGroup)

        } catch (err) {
            console.log('Error', err);
        }

    }

    render() {
        const board = this.props.boards.find(board => board._id === this.boardId)
        if (!board) return <h1>Loading..</h1>
        console.log(board);
        return (
            <section className="board">
                <Navbar />
                <Boardbar />
                <div className="board-container">
                    <BoardHeader onAddGroup={this.onAddGroup} />
                    <div className="groups-container padding-x-15 ">
                        <DragDropContext
                            onDragEnd={this.onDragEnd}
                        >
                            {board.groups.map(group => {
                                return <Group key={group._id}
                                    onEditTask={this.onEditTask} onAddTask={this.onAddTask} onRemoveTask={this.onRemoveTask}
                                    onRemoveGroup={this.onRemoveGroup} onEditGroup={this.onEditGroup} group={group} />
                            })}
                        </DragDropContext>
                    </div>
                </div>
            </section>
        )
    }
}

const mapStateToProps = state => {
    return {
        boards: state.boardReducer.boards
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
    updateBoard
}

export const Board = connect(mapStateToProps, mapDispatchToProps)(_Board);