import React, { Component } from 'react';
import { connect } from 'react-redux';

class _Filter extends Component {
    state = {
        _id: ''
    }

    componentDidMount() {
        this.setState({ ...this.props.board })
    }

    filterGroups = (groupName) => {
        this.setState({ groups: this.state.groups.filter(group => group.name !== groupName) })
    }
    
    removeGroupFilter = (groupName) => {
        const newGroup= this.props.board.groups.find(group=> group.name===groupName)
        this.setState({ groups: [...this.state.groups,newGroup] })
    }

    render() {
        if (!this.state._id) return <h1>Loading...</h1>
        const { groups } = this.state
        const groupsToAdd = this.props.board.groups.filter(group => !this.state.groups.some(selectedGroup => selectedGroup.name === group.name))
        console.log(groupsToAdd);
        console.log(groups);
        return (
            <div className="filter-modal flex absolute">
                <h1>Filter</h1>

                <section className="group-name-filter">
                    <h3>Groups</h3>
                    <div className="groups">
                    {groupsToAdd.map((group, idx) => <p key={idx} onClick={() => this.removeGroupFilter(group.name)}>{group.name}</p>)}
                    </div>
                    
                    {this.state.groups.length && 
                        <div className="selected-groups" style={{backgroundColor:"white"}}>
                           {groups.map((group, idx) => <p key={idx} onClick={() => this.filterGroups(group.name)}>{group.name}</p>)}
                        </div>
                    }
                </section>

                <section className="task-name-filter">
                    <h3>Tasks</h3>
                </section>
                <section className="task-member-filter">
                    <h3>Member</h3>
                </section>
                <section className="task-priority-filter">
                    <h3>Priority</h3>
                </section>
                <section className="task-status-filter">
                    <h3>Status</h3>
                </section>
                <section className="task-date-filter">
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

}

export const Filter = connect(mapStateToProps, mapDispatchToProps)(_Filter);