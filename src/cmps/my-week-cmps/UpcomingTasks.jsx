import React from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

function _UpcomingTasks(props) {

    function getDaysFromNow(date) {
        if (moment(date).isAfter(moment(Date.now()).add(1, 'day').endOf('day'))) {
            return moment(date).format('dddd')
        }
        return moment(date).isBefore(moment().endOf('day')) ? 'Today' : 'Tomorrow'
    }

    function moveToUserProfile(userId) {
        props.history.push(`/user/${userId}`)
    }

    const { tasks, header } = props;

    return <div className="upcoming-tasks">
        <h2>{`${header}: (${tasks.length})`}</h2>
        {tasks.map(task => <div
            key={task.id}
            className="task-preview space-between align-center">
            <div className="left-column">
                <p className="task-preview-name">{task.name}</p>
                <p className="task-location">From: <span onClick={() => props.history.push(`/board/${task.boardId}`)}>{`${task.boardName} > ${task.groupName}`}</span></p>
            </div>
            <section className="right-column flex align-center space-between">
                {/* <div className={`label-box flex align-center ${task.status.toLocaleLowerCase()}`}> <p>{task.status}</p></div> */}
                <div className="user-img-container flex justify-center align-center">
                    {task.members.length !== 0 && (task.members[0].imgUrl ? <img onClick={() => moveToUserProfile(task.members[0]._id)} alt="profile" src={task.members[0].imgUrl} /> :
                        <div onClick={() => moveToUserProfile(task.members[0]._id)} className="member-letter">{task.members[0].fullName.charAt(0).toUpperCase()}</div>)}
                </div>
                <div className="deadline-container flex align-center">
                    <h2>{getDaysFromNow(task.dueDate)}</h2>
                </div>
            </section>
        </div>)}
    </div>
}

export const UpcomingTasks = withRouter(_UpcomingTasks)