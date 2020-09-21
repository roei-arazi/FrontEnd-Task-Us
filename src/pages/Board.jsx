import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import socketService from '../services/socketService';
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
    addTask, removeTask, editTask,  //TASK
    clearFilter //FILTER
}
    from '../store/actions/boardActions'

class _Board extends Component {

    state = {
        boardId: '',
        txt: ''
    }


    async componentDidMount() {
        socketService.setup();
        socketService.emit('board', this.props.match.params.id);
        // socketService.on('chat addMsg', this.addMsg);
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

    componentWillUnmount() {
        socketService.off('chat addMsg', this.addMsg);
        socketService.terminate();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.props.clearFilter();
            this.setState({ boardId: this.props.match.params.id })
        }
    }

    onEditBoard = async (boardName, boardDescription) => {
        const board = this.props.boards.find(board => board._id === this.state.boardId)
        if (boardName === board.name && boardDescription === board.description) return;
        this.props.updateBoard({ ...board, name: boardName, description: boardDescription })
        await this.props.showSnackbar('Updated board.');
        setTimeout(() => this.props.hideSnackbar(), 3000)
    }

    applyFilter = (board, filterBy) => {
        const filteredBoard = JSON.parse(JSON.stringify(board))
        if (filterBy.groupId) {
            filteredBoard.groups = filteredBoard.groups.filter(group => group.id === filterBy.groupId)
        }
        function filterTasks(cb) {
            filteredBoard.groups = filteredBoard.groups.map(group => {
                group.tasks = group.tasks.filter(cb)
                return group;
            })
        }
        if (filterBy.memberId) {
            filterTasks(task => task.members.some(member => member._id === filterBy.memberId))
        }
        if (filterBy.taskPriority) {
            filterTasks(task => task.priority.toLowerCase() === filterBy.taskPriority.toLowerCase())
        }
        if (filterBy.taskStatus) {
            filterTasks(task => task.status.toLowerCase() === filterBy.taskStatus.toLowerCase())
        }
        if (filterBy.dueDate) {
            filterTasks(task => task.dueDate === filterBy.dueDate)
        }
        if (this.state.txt) {
            filterTasks(task => {
                console.log('TASK?', task)
                return (
                    task.name.toLowerCase().includes(this.state.txt.toLowerCase()) ||
                    task.tags.some(tag => tag.txt.toLowerCase().includes(this.state.txt.toLowerCase()))
                )

            })
        }
        return filteredBoard
    }

    //------------------GROUP CRUD-----------------
    onAddGroup = async () => {
        const board = this.props.boards.find(board => board._id === this.state.boardId)
        try {
            await this.props.addGroup(board);
            this.props.clearFilter();
            await this.props.showSnackbar('Added group.');
            setTimeout(() => this.props.hideSnackbar(), 3000)
        } catch (err) {
            console.log('Error', err)
        }
        this.props.history.push(`/board/${this.state.boardId}`)
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
    onAddTask = async (groupId, taskName) => {
        if (!taskName) taskName = 'New task'
        try {
            await this.props.addTask(groupId, taskName)
            this.props.clearFilter()
            this.props.showSnackbar('Added task.');
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

    handleSearch = (ev) => {
        this.setState({ txt: ev.target.value })
    }

    render() {
        if (this.props.boards.length === 0) return <h1>Loading...</h1>
        console.log(this.props.boards);
        const board = this.props.boards.find(board => board._id === this.state.boardId)
        const { users, filterBy } = this.props;
        if (!board) return <h1>Loading..</h1>
        const filteredBoard = this.applyFilter(board, filterBy);
        board.members = users
        return (
            <section className="board">
                <Navbar />
                <Boardbar />
                <div className="board-container">
                    <BoardHeader board={board} onAddGroup={this.onAddGroup} onEditBoard={this.onEditBoard}
                        handleSearch={this.handleSearch} />
                    <div className="groups-container padding-x-30">
                        <DragDropContext
                            onDragEnd={this.onDragEnd}
                        >
                            <Droppable droppableId={board._id} type="group">
                                {(provided, snapshot) =>
                                    <div className={`group-list`}
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}>
                                        {filteredBoard.groups.map((group, index) => {
                                            return <Group key={group.id} index={index}
                                                onEditTask={this.onEditTask} onAddTask={this.onAddTask} onRemoveTask={this.onRemoveTask}
                                                onRemoveGroup={this.onRemoveGroup} onEditGroup={this.onEditGroup} onChangeGroupColor={this.onChangeGroupColor} group={group} users={users} />
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
        users: state.userReducer.users,
        filterBy: state.boardReducer.filterBy
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
    loadUsers,
    clearFilter
}

export const Board = connect(mapStateToProps, mapDispatchToProps)(_Board);