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
    addTask, removeTask, editTask,  //TASK
    clearFilter //FILTER
}
    from '../store/actions/boardActions'
import { groupChanges } from '../store/actions/changesActions'


class _Board extends Component {

    state = {
        boardId: '',
        txt: ''
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
            this.props.clearFilter();
            this.setState({ boardId: this.props.match.params.id })
        }
    }

    onEditBoard = (board, boardName, boardDescription) => {
        this.props.updateBoard({ ...board, name: boardName, description: boardDescription })
        this.props.showSnackbar('Updated board.')
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
                return (
                    task.name.toLowerCase().includes(this.state.txt.toLowerCase())
                    ||
                    task.tags.some(tag => tag.txt.toLowerCase().includes(this.state.txt.toLowerCase()))
                )

            })
        }
        return filteredBoard
    }

    //------------------GROUP CRUD-----------------
    onAddGroup = () => {
        const board = this._getCurrBoard()
        try {
            this.props.addGroup(board);
            this.props.clearFilter();
            this.props.showSnackbar('Added group.');
            setTimeout(() => this.props.hideSnackbar(), 3000)
        } catch (err) {
            console.log('Error', err)
        }
        this.props.history.push(`/board/${this.state.boardId}`)
    }
    onRemoveGroup = (groupId) => {
        const board = this._getCurrBoard()
        try {
            this.props.removeGroup(groupId, board)
            this.props.showSnackbar('Removed group.');
            setTimeout(() => this.props.hideSnackbar(), 3000)
        } catch (err) {
            console.log('Error', err)
        }
    }
    onEditGroup = (groupId, changedValue, originalValue, key) => {
        const board = this._getCurrBoard()
        const group = board.groups.find(group => group.id === groupId)
        if (changedValue === originalValue) return // No changes were made
        group[key] = changedValue;
        try {
            this.props.groupChanges(`${this.props.loggedUser.fullName} Changed board, ${originalValue} title to: ${changedValue}`, this.props.loggedUser, board)
            this.props.editGroup(group, board, originalValue, changedValue)
            this.props.showSnackbar('Updated group.');
            setTimeout(() => this.props.hideSnackbar(), 3000)
        } catch (err) {
            console.log('Error', err)
        }
    }


    //-----------------TASKS CRUD------------------------
    onRemoveTask = (taskId) => {
        const board = this._getCurrBoard()
        let task = null
        board.groups.forEach(group => {
            if (task) return
            task = group.tasks.find(task => task.id === taskId)
        })
        try {
            this.props.removeTask(taskId, board)
            this.props.groupChanges(`${this.props.loggedUser.fullName} Removed task: ${task.name}`, this.props.loggedUser, board)
            this.props.showSnackbar('Removed task.');
            setTimeout(() => this.props.hideSnackbar(), 3000)
        } catch (err) {
            console.log('Error', err)
        }
    }
    onAddTask = (groupId, taskName) => {
        if (!taskName) taskName = 'New task'
        const board = this._getCurrBoard()
        try {
            this.props.addTask(groupId, taskName, board)
            this.props.groupChanges(`${this.props.loggedUser.fullName} Added a new task: ${taskName}`, this.props.loggedUser, board)
            this.props.clearFilter()
            this.props.showSnackbar('Added task.');
            setTimeout(() => this.props.hideSnackbar(), 3000)
        } catch (err) {
            console.log('Error', err)
        }
    }



    onEditTask = (task, changedValue = true, originalValue = false, type) => {
        const board = this._getCurrBoard()

        if (changedValue === originalValue) return
        switch (type) {
            case 'name':
                console.log(`${this.props.loggedUser.fullName} changed ${originalValue} to ${changedValue}`)

                break;
            case 'sendNote':
                console.log(`${this.props.loggedUser.fullName} sent an update at ${task.name}`)

                break;

            default:
                break;
        }
        console.log(`${this.props.loggedUser.fullName} changed ${originalValue} to ${changedValue}`,)
        // this.props.groupChanges(`${this.props.loggedUser.fullName} Removed task: ${task.name}`, this.props.loggedUser, board)

        try {
            this.props.editTask(task, board)
            this.props.showSnackbar('Updated task.');
            setTimeout(() => this.props.hideSnackbar(), 3000)
        } catch (err) {
            console.log('Error', err)
        }
    }
    //---------------------Draggable----------------------

    onDragEnd = result => {
        const { destination, source, draggableId, type } = result
        if (!destination) return;
        if (destination.droppableId === source.droppableId
            &&
            destination.index === source.index) return;

        const board = this._getCurrBoard()

        if (type === 'group') {
            const newGroups = Array.from(board.groups)
            const draggedGroup = newGroups.find(group => group.id === draggableId)
            newGroups.splice(source.index, 1)
            newGroups.splice(destination.index, 0, draggedGroup)
            board.groups = newGroups
            try {
                this.props.updateBoard(board)

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
                    this.props.updateBoard(board)


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

                    this.props.groupChanges(`${this.props.loggedUser.fullName} Moved ${newTaskToPaste.name} from ${newStartGroup.name} to ${newFinishGroup.name}`, this.props.loggedUser, board)
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
    handleBoardBarSearch = (val) => {
        this.setState({ boardBarSearch: val })
    }

    _getCurrBoard = () => {
        return this.props.boards.find(board => board._id === this.state.boardId)
    }

    render() {
        if (this.props.boards.length === 0) return <h1>Loading...</h1>
        const board = this._getCurrBoard()
        const { users, filterBy } = this.props;
        if (!board) return <h1>Loading..</h1>
        const filteredBoard = this.applyFilter(board, filterBy);
        return (
            <section className="board">
                <Navbar />
                <Boardbar handleBoardBarSearch={this.handleBoardBarSearch} />
                <div className="board-container">
                    <BoardHeader board={board} onAddGroup={this.onAddGroup} onEditBoard={this.onEditBoard}
                        handleSearch={this.handleSearch} users={users} />
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
        loggedUser: state.userReducer.loggedUser,
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
    clearFilter,
    groupChanges
}

export const Board = connect(mapStateToProps, mapDispatchToProps)(_Board);