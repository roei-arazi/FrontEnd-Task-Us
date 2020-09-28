import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { IoIosArrowDropdown } from 'react-icons/io';
import { Fade } from '@material-ui/core';

class _UpcomingTasks extends Component {
    state = {
        isShown: true
    }
    
    getDaysFromNow(date) {
        if (moment(date).isAfter(moment().add(1, 'day').endOf('day'))) {
            return moment(date).format('MMM DD')
        }
        return moment(date).isBefore(moment().endOf('day')) ? 'Today' : 'Tomorrow'
    }
    moveToUserProfile(userId) {
        this.props.history.push(`/user/${userId}`)
    }
    toggleIsShown = () => {
        this.setState({ isShown: !this.state.isShown })
    }
    render() {
        const { tasks, header } = this.props;
        return <div className="upcoming-tasks">
            <header className="flex space-between align-center">
                <h2 className="tasks-header">{`${header}: (${tasks.length})`}</h2>
                <IoIosArrowDropdown onClick={this.toggleIsShown}
                    className={this.state.isShown ? "toggle-btn rotate0" : "toggle-btn rotate90"} />
            </header>
            <div className={`upcoming-tasks-container ${!this.state.isShown && 'not-shown'}`}>
                {tasks.map(task => <div
                    key={task.id}
                    className="task-preview space-between align-center">
                    <div className="left-column">
                        <p className="task-preview-name">{task.name}</p>
                        <p className="task-location">At: <span onClick={() => this.props.history.push(`/board/${task.boardId}`)}>{`${task.boardName} > ${task.groupName}`}</span></p>
                    </div>
                    <section className="right-column flex align-center space-between">
                        {/* <div className={`label-box flex align-center ${task.status.toLocaleLowerCase()}`}> <p>{task.status}</p></div> */}
                        <div className="user-img-container flex justify-center align-center">
                            {task.members.length !== 0 && (task.members[0].imgUrl ? <img onClick={() => this.moveToUserProfile(task.members[0]._id)} alt="profile" src={task.members[0].imgUrl} /> :
                                <div onClick={() => this.moveToUserProfile(task.members[0]._id)} className="member-letter">{task.members[0].fullName.charAt(0).toUpperCase()}</div>)}
                        </div>
                        <div className="deadline-container flex align-center" onClick={() => this.props.history.push(`/board/${task.boardId}`)}>
                            <h2 >{this.getDaysFromNow(task.dueDate)}</h2>
                        </div>
                    </section>
                </div>)}

            </div>



        </div>
    }

}
export const UpcomingTasks = withRouter(_UpcomingTasks)