import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Boardbar } from '../cmps/Boardbar';
import { loadBoards } from '../store/actions/boardActions'
import { Navbar } from '../cmps/Navbar';

class _MyWeek extends Component {
    state = {

    }

    componentDidMount() {
        this.props.loadBoards();
    }

   getTasksForDisplay(maxDaysLeft){
        const tasks = [];
        const {boards} = this.props;
        boards.forEach(board => {
            board.groups.forEach(group => {
                tasks.concat(...group.tasks.filter(task => {
                    return task.dueDate < Date.now() + 1000 * 60 * 60 * 24 * maxDaysLeft
                    && task.dueDate > Date.now()
                }))
            })
        })
        return tasks;
    }

    render() {
        console.log(this.getTasksForDisplay(1));
        return (
            <section className="my-week">
                <Navbar />
                <Boardbar />
                <div className="my-week-container">
                    <h1>My week</h1>
                    <section className="">
                        <h2>This week</h2>
                        {/* {this.getTasksForDisplay.map(task => <div>{task.name}</div>)} */}
                    </section>
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
    loadBoards
}

export const MyWeek = connect(mapStateToProps, mapDispatchToProps)(_MyWeek);