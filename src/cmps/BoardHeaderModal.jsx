import React, { Component, Fragment } from 'react'
import { IoMdArrowDropdown } from 'react-icons/io';
import { VscListFilter } from 'react-icons/vsc';
import {Filter} from './Filter'

export  class BoardHeaderModal extends Component {

    state = {
        isInnerModal: false
    }

componentDidMount() {
       
    }
toggleInnerModal = () => {
    this.setState({isInnerModal: !this.state.isInnerModal})
}
closeInnerModal = () => {
    this.setState({isInnerModal: false})
}

    render() {
       const {isInnerModal} = this.state
        return (
            <section onClick={ev => ev.stopPropagation()} className="board-header-modal absolute">
               <div onClick={!this.props.isFiltersOpen ? this.props.onToggleFilters : () => { }}
                                className="filters-outer-container relative flex align-center cursor-pointer"  >

                                {this.props.isFiltering && <div className="filter-active-indicator"></div>}

                                <VscListFilter className={this.props.isFiltering ? 'filter-active' : ''} />
                                <h2 className={this.props.isFiltering ? 'filter-active' : ''}>Filter</h2>
                                
                                <Filter isFiltersOpen={this.props.isFiltersOpen} board={this.props.board} />
                            </div>

        
                                <input  placeholder=" Search Tasks" type='text' onChange={this.props.handleSearch} />
                              
                           
                        {/* MODAL */}
                            <div  className="relative">
                                <button className="flex align-center" onClick={this.toggleInnerModal}>
                                    <h3 >{this.props.isBoardShown ? 'Board' : 'Dashboard'}</h3> <IoMdArrowDropdown />
                                </button>
                               {isInnerModal &&
                               <div>
                                <Fragment>
                                    <div className={`options-modal absolute`}>
                                        <p onClick={() => {
                                            this.toggleInnerModal()
                                                this.props.showBoard()
                                            this.props.toggleOptionsModal()
                                        }}>Board</p>
                                        <p onClick={() => {
                                            this.toggleInnerModal()
                                                this.props.showDashboard()
                                            this.props.toggleOptionsModal()
                                        }}>Dashboard</p>
                                    </div>
                                    <div className="modal-screen-wrapper" onClick={this.closeInnerModal}></div>
                                </Fragment>
                                </div>
                            }
                            </div>
            </section>
        )
    }
}
