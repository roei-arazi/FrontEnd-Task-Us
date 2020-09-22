import React from 'react';
import { GoRequestChanges, GoSearch } from 'react-icons/go'
import { VscListFilter } from 'react-icons/vsc'
import ContentEditable from 'react-contenteditable';
import Activities from './Activities';
import { Filter } from './Filter';
import { withRouter } from 'react-router-dom';
import socketService from '../services/socketService.js'

export class _BoardHeader extends React.Component {

    state = {
        _id: '',
        isActivitiesOpen: false,
        isFiltersOpen: false,
        elSetting: null
    }

    componentDidMount() {
        this.editableName = React.createRef();
        this.editableDescription = React.createRef();
        this.searchInput = React.createRef();

        socketService.on('updatedBoard', () => {
            this.setState({ ...this.props.board })
        })
        this.setState({ ...this.props.board })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.board._id !== this.props.board._id) {
            this.setState({ ...this.props.board })
        }
    }

    handleChangeName = (ev) => {
        this.setState({ name: ev.target.value })
    }

    handleChangeDesc = (ev) => {
        this.setState({ description: ev.target.value })
    }

    focusText = () => {
        setTimeout(() => {
            document.execCommand('selectAll', false, null)
        }, 0)
    }
    onToggleActivities = () => {
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

    render() {

        if (!this.state._id) return <h1>Loading...</h1>
        return (
            <section className="board-header align-center padding-x-30 padding-y-45 ">
                <div className="col-left flex column">
                    <h1>
                        <ContentEditable
                            onFocus={this.focusText}
                            className="content-editable cursor-initial"
                            innerRef={this.editableName}
                            html={this.state.name} // innerHTML of the editable div
                            disabled={false}       // use true to disable editing
                            onChange={this.handleChangeName} // handle innerHTML change
                            onBlur={() => {
                                this.props.onEditBoard(this.state.name, this.state.description)
                            }}
                            onKeyDown={(ev) => {
                                if (ev.key === 'Enter') {
                                    ev.target.blur()
                                    this.props.onEditBoard(this.state.name, this.state.description)
                                }
                            }}
                        />
                    </h1>
                    <h5>
                        <ContentEditable
                            onFocus={this.focusText}
                            className="content-editable cursor-initial"
                            innerRef={this.editableDescription}
                            html={this.state.description} // innerHTML of the editable div
                            disabled={false}        // use true to disable editing
                            onChange={this.handleChangeDesc} // handle innerHTML change
                            onBlur={() => {
                                this.props.onEditBoard(this.state.name, this.state.description)
                            }}
                            onKeyDown={(ev) => {
                                if (ev.key === 'Enter') {
                                    ev.target.blur()
                                    this.props.onEditBoard(this.state.name, this.state.description)
                                }
                            }}
                        />
                    </h5>
                </div>
                <div className="col-right flex align-center">
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
                    <div onClick={this.onToggleActivities} className="activities-outer-container flex align-center  cursor-pointer">
                        <GoRequestChanges />
                        <h2 >Activity Log</h2>
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

            </section>
        )
    }

}

export const BoardHeader = withRouter(_BoardHeader)