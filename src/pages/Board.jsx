import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Boardbar } from '../cmps/Boardbar';
import { BoardHeader } from '../cmps/BoardHeader';
import { Navbar } from '../cmps/Navbar';
import { Group } from '../cmps/Group';
// Reducers funcs
import { loadBoards, addGroup } from '../store/actions/boardActions'

class _Board extends Component {

    boardId = '123'

    async componentDidMount() {

        //TODO: change loadBoard argument to this.props.match.params.id

        try {
            console.log('this.props.boards', this.props.boards)
            if (!this.props.boards || !this.props.boards.length) {
                console.log('LOADING BOARDS',)
                await this.props.loadBoards()
                return
            }
        } catch (err) {
            console.log('Error', err)
        }

    }


    onAddGroup = async () => {
        console.log('Adding group',)
        try {
            await this.props.addGroup(this.boardId)
        } catch (err) {
            console.log('Error', err)
        }
    }
    onRemoveGroup = async (groupId) => {
        console.log('Removing group, group id:', groupId)
        try {
            await this.props.removeGroup(groupId)
        } catch (err) {
            console.log('Error', err)
        }
    }

    render() {
        const board = this.props.boards.find(board => board._id === this.boardId)
        // const board = {
        //     groups: [{ _id: 'g1', name: 'group1' }, { _id: 'g2', name: 'group2' }]
        // }
        if (!board) return <h1>Loading..</h1>
        return (
            <section className="board">
                <Navbar />
                <Boardbar />
                <BoardHeader onAddGroup={this.onAddGroup} />

                {board.groups.map(group => {
                    return <Group onRemoveGroup={this.onRemoveGroup} group={group} />
                })}

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
    loadBoards,
    addGroup
}

export const Board = connect(mapStateToProps, mapDispatchToProps)(_Board);