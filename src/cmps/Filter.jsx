import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateBoard } from '../store/actions/boardActions';

class _Filter extends Component {
    state = {
        _id: '',
        filterBy: {
            groupId: '',
            taskId: ''
        }
    }

    componentDidMount() {
        this.setState({ ...this.props.board })
    }
    

    filterGroups = async (groupId) => {
        await this.setState({ filterBy:  groupId })
        console.log(this.state.filterBy);
        var queryParams = new URLSearchParams();
        for (let key in this.state.filterBy) {
            queryParams.set(key, this.state.filterBy[key])
        }
        this.props.history.push(`/board/${this.state._id}?${queryParams}`)
    }

    filterTasks = async (taskId) => {
        await this.setState({ filterBy: { ...this.state.filterBy, taskId } })
        console.log(this.state.filterBy);
        var queryParams = new URLSearchParams();
        for (let key in this.state.filterBy) {
            queryParams.set(key, this.state.filterBy[key])
        }
        this.props.history.push(`/board/${this.state._id}?${queryParams}`)
    }

    // removeGroupFilter = async (groupId) => {
    //     const newGroup = this.props.board.groups.find(group => group.id !== groupId)
    //     await this.setState({ groups: [...this.state.groups, newGroup], 
    //         filterBy: { ...this.state.filterBy,groupIds: [...this.state.filterBy.groupIds, groupId]}})
    //         this.props.updateBoard(this.state, this.state.filterBy)
    // }

    render() {
        if (!this.state._id) return <h1>Loading...</h1>
        const { groups } = this.state
        const groupsToFilter = this.props.board.groups.filter(group => !this.state.groups.some(selectedGroup => selectedGroup.id === group.id))
        console.log(this.state.filterBy);
        return (
            <div className="filter-modal flex absolute">

                <section className="group-name-filter flex column align-center">
                    <h3>Groups</h3>
                    <div className="groups">
                        {groups.map((group, idx) => <button key={idx} onClick={() => this.filterGroups(group.id)}>{group.name}</button>)}
                    </div>

                    {/* <div className="selected-groups" style={{ backgroundColor: "white" }}>
                    <p>Selected Groups</p>
                    {this.state.groups.length &&
                            groups.map((group, idx) => <p key={idx} onClick={() => this.filterGroups(group.id)}>{group.name}</p>)}
                        </div> */}
                </section>

                <section className="task-name-filter flex column align-center">
                    <h3>Tasks</h3>
                    {groups.map(group => group.tasks.map((task, idx) => <button key={idx} onClick={() => this.filterTasks(task.id)}>{task.name}</button>))}
                </section>
                <section className="task-member-filter flex column align-center">
                    <h3>Member</h3>
                </section>
                <section className="task-priority-filter flex column align-center">
                    <h3>Priority</h3>
                </section>
                <section className="task-status-filter flex column align-center">
                    <h3>Status</h3>
                </section>
                <section className="task-date-filter flex column align-center">
                    <h3>Due-Date</h3>
                </section>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = {
    updateBoard
}

export const Filter = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Filter));