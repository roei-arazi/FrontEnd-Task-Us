import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setFilter } from '../store/actions/boardActions';
import { Fade } from '@material-ui/core';

import moment from 'moment';

function _Filter(props) {
    const { board, filterBy, setFilter } = props;

    function onSetFilter(filterKey, filterValue) {
        if (filterBy[filterKey] === filterValue) filterValue = '';
        setFilter({ ...filterBy, [filterKey]: filterValue })
    }

    function getBoardDates() {
        const dates = {};
        board.groups.forEach(group => {
            group.tasks.forEach(task => {
                const date = moment(task.dueDate).format('DD.MM.YY');
                dates[date] = task.dueDate;
            })
        })
        const res = [];
        for (let key in dates) {
            res.push({ formatted: key, value: dates[key] })
        }
        return res;
    }

    if (!board) return <h1>Loading...</h1>
    const { groups, members } = board;
    const dates = getBoardDates();
    return (
        <Fade in={true}>
            <div className="filter-modal flex absolute">
                <section className="group-name-filter flex column align-center">
                    <h3>Groups</h3>
                    <div className="filter-list">
                        {groups.map((group, idx) => <button className={filterBy.groupId === group.id ? 'remove-filter-btn' : ''} key={idx} onClick={() => onSetFilter('groupId', group.id)}>{group.name}</button>)}
                    </div>
                </section>
                <section className="task-member-filter flex column align-center">
                    <h3>Member</h3>
                    <div className="filter-list">
                        {members.map(member => <button
                            className={filterBy.memberId === member._id ? 'remove-filter-btn' : ''}
                            key={member._id}
                            onClick={() => onSetFilter('memberId', member._id)}>{member.fullName}</button>)}
                    </div>
                </section>
                <section className="task-priority-filter flex column align-center">
                    <h3>Priority</h3>
                    <div className="filter-list">
                        <button className={filterBy.taskPriority === 'low' ? 'remove-filter-btn' : ''} onClick={() => onSetFilter('taskPriority', 'low')}>Low</button>
                        <button className={filterBy.taskPriority === 'medium' ? 'remove-filter-btn' : ''} onClick={() => onSetFilter('taskPriority', 'medium')}>Medium</button>
                        <button className={filterBy.taskPriority === 'high' ? 'remove-filter-btn' : ''} onClick={() => onSetFilter('taskPriority', 'high')}>High</button>
                    </div>
                </section>
                <section className="task-status-filter flex column align-center">
                    <h3>Status</h3>
                    <div className="filter-list">
                        <button className={filterBy.taskStatus === 'done' ? 'remove-filter-btn' : ''} onClick={() => onSetFilter('taskStatus', 'done')}>Done</button>
                        <button className={filterBy.taskStatus === 'working on it' ? 'remove-filter-btn' : ''} onClick={() => onSetFilter('taskStatus', 'working on it')}>Working on it </button>
                        <button className={filterBy.taskStatus === 'stuck' ? 'remove-filter-btn' : ''} onClick={() => onSetFilter('taskStatus', 'stuck')}>Stuck</button>
                    </div>
                </section>
                <section className="task-date-filter flex column align-center">
                    <h3>Due-Date</h3>
                    <div className="filter-list">
                        {dates.map((date, idx) => <button
                            className={filterBy.dueDate === date.value ? 'remove-filter-btn' : ''}
                            key={idx}
                            onClick={() => onSetFilter('dueDate', date.value)}>{date.formatted}</button>)}
                    </div>
                </section>
            </div>
        </Fade>
    )
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