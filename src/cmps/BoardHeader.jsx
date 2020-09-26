import React from 'react';
import { GoSearch } from 'react-icons/go'
import { VscListFilter } from 'react-icons/vsc'
import ContentEditable from 'react-contenteditable';
import Activities from './Activities';
import { Filter } from './Filter';
import { withRouter } from 'react-router-dom';
import socketService from '../services/socketService.js'
import { FiPlus } from 'react-icons/fi';
import { FiMinus } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';

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
    componentWillUnmount() {
        socketService.off('updatedBoard')
    }
    handleChangeName = (ev) => {
        this.setState({ board: { ...this.state.board, name: ev.target.value } })
    }

    handleChangeDesc = (ev) => {
        this.setState({ board: { ...this.state.board, desc: ev.target.value } })
    }

    focusText = () => {
        setTimeout(() => {
            document.execCommand('selectAll', false, null)
        }, 0)
    }
    onToggleActivities = () => {
        let board = this.props.board

        if (this.state.isActivitiesOpen) {
            board = {
                ...board,
                activityLog: board.activityLog.map(activity => {
                    activity.isRead = true
                    return activity
                })
            }

        }
        console.log('new board:!!', board)

        this.props.onEditBoard(board)
        this.setState({ isActivitiesOpen: !this.state.isActivitiesOpen })

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
        const user = this.state.board.members.find(member => member._id === memberId)
        const desc = `${this.props.loggedUser.fullName} removed ${user.fullName} from ${this.state.board.name}`
        this.setState({ board: { ...this.state.board, members: this.state.board.members.filter(member => member._id !== memberId) } }, () => {
            this.props.onEditBoard(this.state.board, desc)
        })
    }
    onAddUserToBoard = (userId) => {
        const newUser = this.props.users.find(user => user._id === userId)
        const desc = `${this.props.loggedUser.fullName} invited ${newUser.fullName} to ${this.state.board.name}`

        this.setState({ board: { ...this.state.board, members: [...this.state.board.members, newUser] } }, () => {
            this.props.onEditBoard(this.state.board, desc)
        })
    }
    goToUserProfile = (userId) => {
        this.props.history.push(`/user/${userId}`)
    }
    onClearLog = () => {
        const board = {
            ...this.state.board,
            activityLog: []
        }
        this.setState({ board }, () => {
            this.props.onEditBoard(board)
        })


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
        if (!this.state._id) return <h1>Loading...</h1>
        const { members } = this.state.board
        const { users, loggedUser, filterBy } = this.props;
        const filterStyle = Object.values(filterBy).some(value => value) ? 'filter-active' : '';
        const usersToAdd = users.filter(user => !members.some(member => member._id === user._id))
        const activitiesNotRead = this.props.board.activityLog.filter(activity => !activity.isRead)
        const activitiesRead = this.props.board.activityLog.filter(activity => activity.isRead)


        return (
            <section className="board-header flex column padding-x-30">
                <div className="board-header-header flex space-between grow align-center">
                    <h1 className="flex align-center">
                        <ContentEditable
                            onFocus={this.focusText}
                            className="content-editable cursor-initial"
                            innerRef={this.editableName}
                            html={this.state.board.name}
                            disabled={false}
                            onChange={this.handleChangeName}
                            onBlur={() => {
                                const desc = `${loggedUser.fullName} Changed the board title from ${this.props.board.name} to ${this.state.board.name}`
                                console.log('state name:', this.state.board)
                                const board = {
                                    ...this.props.board,
                                    name: this.state.board.name
                                }

                                this.props.onEditBoard(board, desc)
                            }}
                            onKeyDown={(ev) => {
                                if (ev.key === 'Enter') {
                                    ev.target.blur()
                                }
                            }}
                        />
                    </h1>
                    <div className="board-header-right relative flex align-center">
                        <div className="board-users flex justify-center" onClick={this.onToggleUsers}>
                            {members.length === 0 && <div className="user-img-container"> <CgProfile /></div>}
                            {members.length !== 0 && members.map((member, idx) => {
                                return <div key={idx} className="user-img-container">
                                    {
                                        member.imgUrl ? <img src={member.imgUrl} />
                                            :
                                            <img src="https://www.flaticon.com/svg/static/icons/svg/847/847969.svg" />

                                    }
                                </div>
                            })}
                        </div>
                        {this.state.isUsersOpen &&
                            <div className="users-modal absolute">
                                <div className="board-users-box">
                                    <h3>Board Members</h3>
                                    {members.map((member, idx) =>
                                        <section key={idx} className="user-box flex space-between align-center">
                                            <div className="user-box-info flex align-center" onClick={() => this.goToUserProfile(member._id)}>
                                                {member.imgUrl
                                                    ? <img src={member.imgUrl} alt="profile" />
                                                    : <div className="member-letter">
                                                        {this._getMemeberInitials(member)[0]}
                                                        {this._getMemeberInitials(member)[1]}
                                                    </div>}
                                                <p className="member-name">{member.fullName}</p>
                                            </div>
                                            {
                                                (loggedUser._id === "5f68936cf878123b2cd354436ce96d" ||
                                                    this.state.board.boardCreator._id === loggedUser._id) &&
                                                <FiMinus onClick={() => this.onRemoveMemberFromBoard(member._id)} />
                                            }
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
                                            {
                                                (loggedUser._id === "5f68936cf878123b2cd354436ce96d" ||
                                                    this.state.board.boardCreator._id === loggedUser._id) &&
                                                <FiPlus onClick={() => this.onAddUserToBoard(user._id)} />
                                            }
                                        </section>
                                    })}
                                </div>

                            </div>}
                        <div onClick={this.onToggleActivities} className="activities-outer-container flex align-center  cursor-pointer">
                            <h2>
                                Activities {" "}
                                <span style={{ color: activitiesNotRead.length !== 0 ? '#0085ff' : '' }}>
                                    {activitiesNotRead.length}
                                </span>
                              / {activitiesRead.length + activitiesNotRead.length}
                            </h2>
                        </div>
                    </div>

                </div>
                <div className="board-header-footer flex align-center space-between">
                    <h5>
                        <ContentEditable
                            onFocus={this.focusText}
                            className="content-editable cursor-initial"
                            innerRef={this.editableDescription}
                            html={this.state.board.desc} // innerHTML of the editable div
                            disabled={false}        // use true to disable editing
                            onChange={this.handleChangeDesc} // handle innerHTML change
                            onBlur={() => {
                                const desc = `${loggedUser.fullName} Changed ${this.state.board.name} description to ${this.state.board.desc}`

                                const board = {
                                    ...this.props.board,
                                    desc: this.state.board.desc
                                }

                                this.props.onEditBoard(board, desc)
                            }}
                            onKeyDown={(ev) => {
                                if (ev.key === 'Enter') {
                                    ev.target.blur()
                                }
                            }}
                        />
                    </h5>
                    <div className="header-options flex">
                        <button className="new-group-btn" onClick={this.props.onAddGroup}>New Group</button>
                        <div onClick={() => this.searchInput.focus()} className="search-outer-container flex align-center">
                            <input ref={(input) => { this.searchInput = input; }} placeholder="Search" type='text' onChange={this.props.handleSearch} />
                            <GoSearch />
                        </div>
                        <div onClick={!this.state.isFiltersOpen ? this.onToggleFilters : () => { }}
                            
                            className="filters-outer-container relative flex align-center cursor-pointer"  >
                            <VscListFilter className={filterStyle} />
                            <h2 className={filterStyle}>Filter</h2>
                            {
                                this.state.isFiltersOpen &&

                                <Filter board={this.props.board} />

                            }
                        </div>



                    </div>
                    <div className={`${this.state.isActivitiesOpen && 'animate-side-modal'} side-modal`}>
                        <Activities onClearLog={this.onClearLog} onToggleActivities={this.onToggleActivities}
                            boardName={this.state.board.name} activityLog={this.props.board.activityLog} />
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