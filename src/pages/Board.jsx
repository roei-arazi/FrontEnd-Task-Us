import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { showSnackbar, hideSnackbar } from '../store/actions/systemActions.js';
import lodash from 'lodash'
// Inside imports
import { userService } from '../services/userService.js';
import { Boardbar } from '../cmps/Boardbar';
import { BoardHeader } from '../cmps/BoardHeader';
import { Navbar } from '../cmps/Navbar';
import { Group } from '../cmps/Group';
import { Popup } from '../cmps/Popup'
import { loadUsers } from '../store/actions/userActions'
import {
    updateBoard, loadBoards,
    addGroup, editGroup, removeGroup,
    addTask, removeTask, editTask,
    clearFilter
}
    from '../store/actions/boardActions'
import { groupChanges } from '../store/actions/changesActions'
import { MobileNav } from '../mobile-pages/MobileNav';
import { Dashboard } from '../cmps/Dashboard.jsx';

class _Board extends Component {
    state = {
        boardId: '',
        txt: '',
        isBoardShown: true,
        isDashboardShown: false,
        isModalShown: false
    }
    async componentDidMount() {
        if (!this.props.loggedUser) this.props.history.push("/")
        try {
            if (!this.props.boards || !this.props.boards.length) {
                await this.props.loadBoards();
            }

            if (!this.props.users || !this.props.users.length) {
                await this.props.loadUsers();
            }
        } catch (err) {
            console.log('Error', err)
        }
        this.setState({ boardId: this.props.match.params.id })
    }
    displayPopup(msg) {
        this.props.showSnackbar(msg)
        setTimeout(this.props.hideSnackbar, 3000)
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.props.clearFilter();
            this.setState({ boardId: this.props.match.params.id })
        }
    }
    onEditBoard = async (newBoard, desc) => {
        const { loggedUser } = this.props;

        this.props.updateBoard(newBoard, desc, loggedUser)
        userService.notifyUsers(`${newBoard.name}: ${desc}`, newBoard.members, loggedUser)
        if (desc) this.displayPopup('Updated board.')
    }
    applyFilter = (board, filterBy) => {
        const filteredBoard = lodash.cloneDeep(board)
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
        filteredBoard.groups = filteredBoard.groups.filter(group => group.tasks.length)
        return filteredBoard
    }
    //------------------GROUP CRUD-----------------
    onAddGroup = async () => {
        const { loggedUser } = this.props;
        const board = this._getCurrBoard()
        try {
            this.props.addGroup(board, this.props.loggedUser);
            userService.notifyUsers(`${board.name}: ${loggedUser.fullName} added a group.`, board.members, loggedUser)
            this.props.clearFilter();
            this.displayPopup('Added group.')

        } catch (err) {
            console.log('Error', err)
        }
        this.props.history.push(`/board/${this.state.boardId}`)
    }
    onRemoveGroup = async (groupId) => {
        const { loggedUser } = this.props;
        const board = this._getCurrBoard()
        const group = board.groups.find(group => group.id === groupId);
        const notif = `${board.name}: ${loggedUser.fullName} removed group ${group.name}`;
        try {
            this.props.removeGroup(groupId, board, this.props.loggedUser)
            userService.notifyUsers(notif, board.members, loggedUser);
            this.displayPopup('Removed group.')
        } catch (err) {
            console.log('Error', err)
        }
    }
    onEditGroup = async (groupId, changedValue, key) => {
        const { loggedUser } = this.props;
        const board = this._getCurrBoard()
        const group = board.groups.find(group => group.id === groupId)
        if (group[key] === changedValue) return;
        const originalValue = group[key];
        group[key] = changedValue;
        try {
            const desc = `${group.name}: ${loggedUser.fullName} Changed ${key} from ${originalValue} to ${changedValue}`;
            this.props.editGroup(group, board, desc, loggedUser)
            userService.notifyUsers(desc, board.members, loggedUser);
            this.displayPopup('Updated group.')
        } catch (err) {
            console.log('Error', err)
        }
    }


    //-----------------TASKS CRUD------------------------
    onRemoveTask = async (taskId, group) => {
        const { loggedUser } = this.props;
        const board = this._getCurrBoard()
        try {
            const task = group.tasks.find(task => task.id === taskId);
            const notif = `${loggedUser.fullName} Removed the task ${task.name} from ${group.name}`;
            this.props.removeTask(taskId, board, group, loggedUser);
            userService.notifyUsers(notif, board.members, loggedUser);
            this.displayPopup('Removed task.');
        } catch (err) {
            console.log('Error', err)
        }
    }
    onAddTask = async (groupId, taskName) => {
        if (!taskName) taskName = 'New task'
        const { loggedUser } = this.props;
        const board = this._getCurrBoard()
        const group = board.groups.find(group => group.id === groupId)
        const notif = ` ${board.name}: ${loggedUser.fullName} Added a task to ${group.name}`;
        try {
            this.props.addTask(groupId, taskName, board, loggedUser)
            userService.notifyUsers(notif, board.members, loggedUser)
            this.props.clearFilter()
            this.displayPopup('Added task.')

        } catch (err) {
            console.log('Error', err)
        }
    }
    onEditTask = async (task, prevTask, desc) => {
        if (lodash.isEqual(task, prevTask)) return;
        const board = this._getCurrBoard()
        const { loggedUser } = this.props;
        this.props.editTask(task, board, desc, this.props.loggedUser)
        userService.notifyUsers(`${board.name}: ${desc}`, board.members, loggedUser)
        this.displayPopup('Updated task.')
    }
    //---------------------Draggable----------------------
    onDragEnd = async result => {
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
                    const { loggedUser } = this.props;
                    const desc = `${loggedUser.fullName} Moved ${newTaskToPaste.name} from ${newStartGroup.name} to ${newFinishGroup.name}`
                    this.props.updateBoard(this._getCurrBoard(), desc, loggedUser)
                    userService.notifyUsers(`${board.name}: ${desc}`, board.members, loggedUser)
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
    showBoard = () => {
        this.setState({ isBoardShown: true, isDashboardShown: false, isModalShown: false })
    }
    showDashboard = () => {
        this.setState({ isDashboardShown: true, isBoardShown: false, isModalShown: false })
    }
    toggleModal = () => {
        this.setState({ isModalShown: !this.state.isModalShown })
    }
    render() {
        const board = this._getCurrBoard()
        const { users, filterBy } = this.props;
        if (!board) {
            return (
                <div className="loader-container flex justify-center align-center">
                    <img src="loading.gif" alt="" />
                </div>
            )
        }
        const filteredBoard = this.applyFilter(board, filterBy);
        return (
            <section className={`board ${window.innerWidth > 600 ? 'flex' : 'flex column'}`}>
                {window.innerWidth > 600 ?
                    <React.Fragment>
                        <Navbar />
                        <Boardbar handleBoardBarSearch={this.handleBoardBarSearch} />
                    </React.Fragment>
                    :
                    <MobileNav boardName={board.name} members={board.members} params={this.props.match.params} loggedUser={this.props.loggedUser} />
                }
                <div className="board-container">
                    {window.innerWidth > 600 && <BoardHeader filterBy={filterBy} loggedUser={this.props.loggedUser} board={board} onAddGroup={this.onAddGroup} onEditBoard={this.onEditBoard}
                        handleSearch={this.handleSearch} users={users} showBoard={this.showBoard}
                        showDashboard={this.showDashboard} toggleModal={this.toggleModal} isModalShown={this.state.isModalShown}
                        isBoardShown={this.state.isBoardShown} />}
                    {this.state.isBoardShown ?
                        <div className={`groups-container ${window.innerwidth > 600 && 'padding-x-30'}`} style={{ height: `${window.innerWidth < 600 && 94 + 'vh'}` }}>
                            <DragDropContext
                                onDragEnd={this.onDragEnd}>
                                <Droppable droppableId={board._id} type="group">
                                    {(provided, snapshot) =>
                                        <div className={`group-list`}
                                            ref={provided.innerRef}
                                            {...provided.droppableProps} >
                                            {filteredBoard.groups.map((group, index) => {
                                                return <Group key={group.id} index={index}
                                                    onEditTask={this.onEditTask} onAddTask={this.onAddTask} onRemoveTask={this.onRemoveTask}
                                                    onRemoveGroup={this.onRemoveGroup} onEditGroup={this.onEditGroup}
                                                    onChangeGroupColor={this.onChangeGroupColor} group={group} users={board.members} />
                                            })}
                                            {provided.placeholder}
                                        </div>
                                    }
                                </Droppable>
                            </DragDropContext>
                            {window.innerWidth < 600 &&
                                <BsFillPlusCircleFill className="group-add-btn" onClick={this.onAddGroup} />
                            }
                        </div>
                        :
                        <Dashboard board={board} />
                    }
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