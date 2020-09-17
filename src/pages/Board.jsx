import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { Boardbar } from '../cmps/Boardbar';
import { BoardHeader } from '../cmps/BoardHeader';
import { Navbar } from '../cmps/Navbar';
import { Group } from '../cmps/Group';
// Reducers funcs
import { updateBoard, loadBoards, addGroup, editGroup, removeGroup, addTask, removeTask, editTask } from '../store/actions/boardActions'
import { boardService } from '../services/boardService';

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
    onEditGroup = async (groupId) => {
        console.log('Editing group, group id:', groupId)
        try {
            await this.props.editGroup(groupId)
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
        const groupStart = board.groups.find(group => group.id === source.droppableId)
        const groupEnd= board.groups.find(group => group.id === destination.droppableId)
        
        if(groupStart.id===groupEnd.id){
            
            const newTasks = Array.from(groupStart.tasks)
            const newTask = groupStart.tasks.find(task => task.id === draggableId)
    
            newTasks.splice(source.index, 1)
            newTasks.splice(destination.index, 0, newTask)
    
            const newGroup = {
                ...groupStart,
                tasks: newTasks
            }
            const newIdx= board.groups.findIndex(group=> group.id===newGroup.id)
            board.groups.splice(newIdx,1,newGroup)
            try {
                await this.props.updateBoard(board)
    
            } catch (err) {
                console.log('Error', err);
            }
        }

        const startTasks= Array.from(groupStart.tasks)
        startTasks.splice(source.index,1)
        const newStartGroup={
            ...groupStart,
            tasks:startTasks
        }
        const endTasks= Array.from(groupEnd.tasks)
        const newTaskToPaste= groupStart.tasks.find(task=> task.id===draggableId)
        endTasks.splice(destination.index,0, newTaskToPaste)
        const newFinishGroup={
            ...groupEnd,
            tasks:endTasks
        }

        const startIdx=board.groups.findIndex(group=> group.id===newStartGroup.id)
        const endIdx=board.groups.findIndex(group=> group.id===newFinishGroup.id)

        board.groups.splice(startIdx,1,newStartGroup)
        board.groups.splice(endIdx,1,newFinishGroup)
        console.log('ROW 136!', board);
        try{
            this.props.updateBoard(board)
        }catch(err){
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