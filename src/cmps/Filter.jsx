import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setFilter} from '../store/actions/boardActions';

class _Filter extends Component {
    state = {
        _id: ''
    }

    componentDidMount() {
        console.log('mounting filter again');
        this.setState({ ...this.props.board })
    }
    

    filterGroups = (groupId) => {
        const {filterBy, setFilter} = this.props;
        setFilter({...filterBy, groupId})
    }

    filterTasks = async (taskId) => {
        const {filterBy, setFilter} = this.props;
        setFilter({...filterBy, taskId})
    }

    // removeGroupFilter = async (groupId) => {
    // }

    render() {
        if (!this.state._id) return <h1>Loading...</h1>
        const { groups } = this.state;
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
        filterBy: state.boardReducer.filterBy
    }
}

const mapDispatchToProps = {
    setFilter
}

export const Filter = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Filter));