import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setFilter} from '../store/actions/boardActions';
import moment from 'moment';

class _Filter extends Component {
    // state = {
    //     _id: ''
    // }

    // componentDidMount() {
    //     console.log('mounting filter again');
    //     this.setState({ ...this.props.board })
    // }
    
    onSetFilter = (filterKey, filterValue) =>{
        const {filterBy, setFilter} = this.props;
        if(filterBy[filterKey] === filterValue) filterValue = '';
        setFilter({...filterBy, [filterKey]: filterValue})
    }

    getBoardDates = (board) =>{
        const dates = {};
        board.groups.forEach(group =>{
            group.tasks.forEach(task =>{
                const date = moment(task.dueDate).format('DD.MM.YY');
                dates[date] = task.dueDate;
            })
        })
        const res = [];
        for(let key in dates){
            res.push({formatted: key, value: dates[key]})
        }
        console.log('got dates:', res);
        return res;
    }

    render() {
        const {board, filterBy} = this.props;
        if (!board) return <h1>Loading...</h1>
        const { groups, members } = board;
        const dates = this.getBoardDates(board)
        return (
            <div className="filter-modal flex absolute">

                <section className="group-name-filter flex column align-center">
                    <h3>Groups</h3>
                    <div className="filter-list">
                        {groups.map((group, idx) => <button className={filterBy.groupId === group.id ? 'remove-filter-btn' : ''} key={idx} onClick={() => this.onSetFilter('groupId', group.id)}>{group.name}</button>)}
                    </div>

                    {/* <div className="selected-groups" style={{ backgroundColor: "white" }}>
                    <p>Selected Groups</p>
                    {this.state.groups.length &&
                            groups.map((group, idx) => <p key={idx} onClick={() => this.filterGroups(group.id)}>{group.name}</p>)}
                        </div> */}
                </section>

                {/* <section className="task-name-filter flex column align-center">
                    <h3>Tasks</h3>
                    <div className="filter-list">
                    {groups.map(group => group.tasks.map(task => <button 
                    className={filterBy.taskId === task.id ? 'remove-filter-btn' : ''}
                     key={task.id}
                      onClick={() => this.onSetFilter('taskId', task.id)}>{task.name}</button>))}
                    </div>
                </section> */}
                <section className="task-member-filter flex column align-center">
                    <h3>Member</h3>
                    <div className="filter-list">
                    {members.map(member => <button
                     className={filterBy.memberId === member._id ? 'remove-filter-btn' : ''}
                      key={member._id} 
                      onClick={() => this.onSetFilter('memberId', member._id)}>{member.fullName}</button>)}
                    </div>
                </section>
                <section className="task-priority-filter flex column align-center">
                    <h3>Priority</h3>
                    <div className="filter-list">
                        <button className={filterBy.taskPriority === 'low' ? 'remove-filter-btn' : ''} onClick={() => this.onSetFilter('taskPriority', 'low')}>Low</button>
                        <button className={filterBy.taskPriority === 'medium' ? 'remove-filter-btn' : ''} onClick={() => this.onSetFilter('taskPriority', 'medium')}>Medium</button>
                        <button className={filterBy.taskPriority === 'high' ? 'remove-filter-btn' : ''} onClick={() => this.onSetFilter('taskPriority', 'high')}>High</button>
                    </div>
                </section>
                <section className="task-status-filter flex column align-center">
                    <h3>Status</h3>
                    <div className="filter-list">
                        <button className={filterBy.taskStatus === 'done' ? 'remove-filter-btn' : ''} onClick={() => this.onSetFilter('taskStatus', 'done')}>Done</button>
                        <button className={filterBy.taskStatus === 'working on it' ? 'remove-filter-btn' : ''} onClick={() => this.onSetFilter('taskStatus', 'working on it')}>Working on it </button>
                        <button className={filterBy.taskStatus === 'stuck' ? 'remove-filter-btn' : ''} onClick={() => this.onSetFilter('taskStatus', 'stuck')}>Stuck</button>
                    </div>
                </section>
                <section className="task-date-filter flex column align-center">
                    <h3>Due-Date</h3>
                    <div className="filter-list">
                        {dates.map((date, idx) => <button
                     className={filterBy.dueDate === date.value ? 'remove-filter-btn' : ''}
                      key={idx} 
                      onClick={() => this.onSetFilter('dueDate', date.value)}>{date.formatted}</button>)}
                    </div>
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