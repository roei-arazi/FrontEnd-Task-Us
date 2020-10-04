import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BsFillPlusCircleFill, } from 'react-icons/bs';
// inside imports
import { loadUsers } from '../store/actions/userActions';
import { addBoard, loadBoards, removeBoard } from '../store/actions/boardActions.js';
import { MobileNav } from '../mobile-pages/MobileNav';
import { FaTrash } from 'react-icons/fa';

class _Boards extends Component {
    async componentDidMount() {
        try {
            if (!this.props.boards || !this.props.boards.length) {
                await this.props.loadBoards();
                try {
                    if (!this.props.users || !this.props.users.length) {
                        await this.props.loadUsers();
                    }
                } catch (err) {
                    console.log('Error', err)
                }
            }
        } catch (err) {
            console.log('Error', err)
        }
    }
    goToBoard = (boardId) => {
        this.props.history.push(`/board/${boardId}`)
    }
    onAddBoard = () => {
        this.props.addBoard(this.props.loggedUser)
    }
    _getMemeberInitials(member) {
        let [firstName, lastName] = member.fullName.split(" ")
        let firstNameChar = ''
        let lastNameChar = ''
        if (firstName) firstNameChar = firstName.charAt(0).toUpperCase()
        if (lastName) lastNameChar = lastName.charAt(0).toUpperCase()
        return [firstNameChar, lastNameChar]
    }
    render() {
        if (this.props.boards.length === 0) return <h1>Loading...</h1>
        return (
            <React.Fragment>
                <MobileNav loggedUser={this.props.loggedUser} />
                <div className="boards-list flex column align-center relative">
                    {this.props.boards.map(board =>
                        <div key={board._id} className="board-details flex column relative" onClick={() => this.goToBoard(board._id)}>
                            <div className="board-details-header flex  space-between">
                                <FaTrash className="remove-board-icon" onClick={() => this.props.removeBoard(board._id)} />
                                <h2>{board.name}</h2>
                                <div className="board-members-imgs flex">
                                    {board.members.map(member =>
                                        member.imgUrl ?
                                            <img className="member-img" key={member._id} src={member.imgUrl} alt="" />
                                            :
                                            <div key={member._id} className="member-letter member-img">
                                                {this._getMemeberInitials(member)[0]}
                                                {this._getMemeberInitials(member)[1]}
                                            </div>
                                    )}
                                </div>
                            </div>
                            <div className="board-details-main flex column wrap">
                                {board.groups.map(group => <p style={{ color: group.color }} key={group.id}>{group.name}</p>)}
                            </div>
                        </div>
                    )}
                    <BsFillPlusCircleFill className="add-group-icon" onClick={this.onAddBoard} />
                </div>
            </React.Fragment>
        )
    }
}
const mapStateToProps = state => {
    return {
        boards: state.boardReducer.boards,
        users: state.userReducer.users,
        loggedUser: state.userReducer.loggedUser
    }
}
const mapDispatchToProps = {
    loadBoards,
    addBoard,
    loadUsers,
    removeBoard
}
export const Boards = connect(mapStateToProps, mapDispatchToProps)(_Boards);