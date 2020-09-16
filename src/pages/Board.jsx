import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { Boardbar } from '../cmps/Boardbar';
import { BoardHeader } from '../cmps/BoardHeader';
import { Navbar } from '../cmps/Navbar';
import { Group } from '../cmps/Group';
// Reducers funcs
import { loadBoards, addGroup, removeGroup, addTask, removeTask } from '../store/actions/boardActions'

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

    onDragEnd = result => {
        const {destination, source, draggableId}= result

        if(!destination) return;
        if(destination.droppableId === source.droppableId
            &&
            destination.index===source.index)return;
    }

    render() {
        const board = this.props.boards.find(board => board._id === this.boardId)

        if (!board) return <h1>Loading..</h1>
        return (
            <section className="board">
                <Navbar />
                <Boardbar />
                <div className="board-container">
                    <BoardHeader onAddGroup={this.onAddGroup} />
                    <DragDropContext
                        onDragEnd={this.onDragEnd}
                    >
                        {board.groups.map(group => {
                            return <Group key={group._id} onAddTask={this.onAddTask} onRemoveTask={this.onRemoveTask}
                                onRemoveGroup={this.onRemoveGroup} group={group} />
                        })}
                    </DragDropContext>
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
    removeTask
}

export const Board = connect(mapStateToProps, mapDispatchToProps)(_Board);