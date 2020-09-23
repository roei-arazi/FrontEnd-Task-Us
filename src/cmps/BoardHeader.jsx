import React from 'react';
import { connect } from 'react-redux';
import { GoRequestChanges, GoSearch } from 'react-icons/go'
import { VscListFilter } from 'react-icons/vsc'
import ContentEditable from 'react-contenteditable';
import Activities from './Activities';
import { Filter } from './Filter';
import { withRouter } from 'react-router-dom';
import socketService from '../services/socketService.js'
import { FiPlus } from 'react-icons/fi';
import { AiOutlineMinus } from 'react-icons/ai';

export class _BoardHeader extends React.Component {

    state = {
        _id: '',
        isActivitiesOpen: false,
        isFiltersOpen: false,
        isUsersOpen: false,
        elSetting: null
    }

    componentDidMount() {
        this.editableName = React.createRef();
        this.editableDescription = React.createRef();
        this.searchInput = React.createRef();

        socketService.on('updatedBoard', () => {
            this.setState({ board: this.props.board })
        })
        this.setState({ board: this.props.board, _id: this.props.board._id })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.board._id !== this.props.board._id) {
            this.setState({ board: this.props.board })
        }
    }

    handleChangeName = (ev) => {
        this.setState({ board: { ...this.state.board, name: ev.target.value } })
    }

    handleChangeDesc = (ev) => {
        this.setState({ board: { ...this.state.board, description: ev.target.value } })
    }

    focusText = () => {
        setTimeout(() => {
            document.execCommand('selectAll', false, null)
        }, 0)
    }
    onToggleActivities = () => {
        this.setState({ isActivitiesOpen: !this.state.isActivitiesOpen })
        let board = this.props.board

        if (this.state.isActivitiesOpen) {
            console.log('CHANGING TO READ',)
            board = {
                ...board,
                activityLog: board.activityLog.map(activity => {
                    activity.isRead = true
                    return activity
                })
            }

        }
        this.props.onEditBoard(board, this.state.board.name, this.state.board.description, true)

    }

    onToggleFilters = () => {
        this.setState({ isFiltersOpen: !this.state.isFiltersOpen })
    }

    handleMenuOpen = (ev, boardId) => {
        this.setState({ elSetting: ev.currentTarget })
    }

    handleMenuClose = () => {
        this.setState({ elSetting: null })
    }

    onToggleUsers = () => {
        this.setState({ isUsersOpen: !this.state.isUsersOpen })
    }

    onRemoveMemberFromBoard = (memberId) => {
        this.setState({ board: { ...this.state.board, members: this.state.board.members.filter(member => member._id !== memberId) } }, () => {
            this.props.onEditBoard(this.state.board, this.state.board.name, this.state.board.description)
        })
    }

    onAddUserToBoard = (userId) => {
        const newUser = this.props.users.find(user => user._id === userId)
        this.setState({ board: { ...this.state.board, members: [...this.state.board.members, newUser] } }, () => {
            this.props.onEditBoard(this.state.board, this.state.board.name, this.state.board.description)
        })
    }

    goToUserProfile = (userId) => {
        this.props.history.push(`/user/${userId}`)
    }

    render() {
        if (!this.state._id) return <h1>Loading...</h1>
        const { board } = this.state
        const { members } = this.state.board
        const { users } = this.props
        const usersToAdd = users.filter(user => !members.some(member => member._id === user._id))
        return (
            <section className="board-header flex column padding-x-30">
                <div className="board-header-header flex space-between grow align-center">
                    <h1 className="flex align-center">
                        <ContentEditable
                            onFocus={this.focusText}
                            className="content-editable cursor-initial"
                            innerRef={this.editableName}
                            html={board.name} // innerHTML of the editable div
                            disabled={false}       // use true to disable editing
                            onChange={this.handleChangeName} // handle innerHTML change
                            onBlur={() => {
                                this.props.onEditBoard(board, board.name, board.description)
                            }}
                            onKeyDown={(ev) => {
                                if (ev.key === 'Enter') {
                                    ev.target.blur()
                                    this.props.onEditBoard(board, board.name, board.description)
                                }
                            }}
                        />
                    </h1>
                    <div className="board-header-right relative flex align-center">
                        <div className="board-users flex justify-center" onClick={this.onToggleUsers}>
                            {members.map(member => {
                                return <div key={member._id} className="user-img-container">
                                    <img src={member.imgUrl} />
                                </div>
                            })}
                        </div>
                        {this.state.isUsersOpen &&
                            <div className="users-modal absolute">
                                <div className="board-users-box">
                                    <h3>Board Members</h3>
                                    {members.map(member =>
                                        <section key={member._id} className="user-box flex space-between align-center">
                                            <div className="user-box-info flex align-center" onClick={() => this.goToUserProfile(member._id)}>
                                                {member.imgUrl ? <img src={member.imgUrl} alt="profile" /> : <div className="member-letter">{member.fullName.charAt(0).toUpperCase()}</div>}
                                                <p className="member-name">{member.fullName}</p>
                                            </div>
                                            <AiOutlineMinus onClick={() => this.onRemoveMemberFromBoard(member._id)} />
                                        </section>
                                    )}

                                </div>
                                <div className="site-users-box">
                                    <h3>Site Users</h3>
                                    {usersToAdd.map(user => {
                                        return <section key={user._id} className="user-box flex space-between align-center">
                                            <div className="user-box-info flex  align-center" onClick={() => this.goToUserProfile(user._id)}>
                                                {user.imgUrl ? <img src={user.imgUrl} alt="profile" /> :
                                                    <div className="member-letter">{user.fullName.charAt(0).toUpperCase()}</div>}
                                                <p className="member-name">{user.fullName}</p>
                                            </div>
                                            <FiPlus onClick={() => this.onAddUserToBoard(user._id)} />
                                        </section>
                                    })}
                                </div>

                            </div>}
                        <div onClick={this.onToggleActivities} className="activities-outer-container flex align-center  cursor-pointer">
                            <GoRequestChanges />
                            <h2 >Activity Log</h2>
                        </div>
                    </div>

                </div>
                <div className="board-header-footer flex align-center space-between">
                    <h5>
                        <ContentEditable
                            onFocus={this.focusText}
                            className="content-editable cursor-initial"
                            innerRef={this.editableDescription}
                            html={this.state.board.description} // innerHTML of the editable div
                            disabled={false}        // use true to disable editing
                            onChange={this.handleChangeDesc} // handle innerHTML change
                            onBlur={() => {
                                this.props.onEditBoard(board, board.name, board.description)
                            }}
                            onKeyDown={(ev) => {
                                if (ev.key === 'Enter') {
                                    ev.target.blur()
                                    this.props.onEditBoard(board, board.name, board.description)
                                }
                            }}
                        />
                    </h5>
                    <div className="header-options flex">
                        <button onClick={this.props.onAddGroup}>New Group</button>
                        <div onClick={() => this.searchInput.focus()} className="search-outer-container flex align-center">
                            <input ref={(input) => { this.searchInput = input; }} placeholder="Search" type='text' onChange={this.props.handleSearch} />
                            <GoSearch />
                        </div>
                        <div onClick={!this.state.isFiltersOpen ? this.onToggleFilters : () => { }} className="filters-outer-container relative flex align-center cursor-pointer"  >
                            <VscListFilter />
                            <h2>Filter</h2>
                            {
                                this.state.isFiltersOpen &&

                                <Filter board={this.props.board} />

                            }
                        </div>



                    </div>
                    <div className={`${this.state.isActivitiesOpen && 'animate-side-modal'} side-modal`}>
                        <Activities onToggleActivities={this.onToggleActivities}
                            boardName={this.props.board.name} activityLog={this.props.board.activityLog} />
                    </div>
                    {
                        this.state.isFiltersOpen && <div onClick={this.onToggleFilters} className='modal-screen-wrapper'></div>
                    }

                    {
                        this.state.isActivitiesOpen && <div onClick={this.onToggleActivities} className='modal-screen-wrapper'></div>
                    }
                    {
                        this.state.isUsersOpen && <div onClick={this.onToggleUsers} className='modal-screen-wrapper'></div>
                    }
                </div>


            </section>
        )
    }

}


export const BoardHeader = withRouter(_BoardHeader)