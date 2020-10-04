import React, { Component } from 'react'
import { GoSearch } from 'react-icons/go';
import { IoMdArrowDropdown } from 'react-icons/io';
import { VscListFilter } from 'react-icons/vsc';
import {Filter} from './Filter'

export  class BoardHeaderModal extends Component {

    state = {

    }

componentDidMount() {
    this.searchInput = React.createRef();
}
    render() {
        
        return (
            <section className="board-header-modal">
               <div onClick={!this.props.isFiltersOpen ? this.props.onToggleFilters : () => { }}
                                className="filters-outer-container relative flex align-center cursor-pointer"  >

                                {this.props.isFiltering && <div className="filter-active-indicator"></div>}

                                <VscListFilter className={this.props.isFiltering ? 'filter-active' : ''} />
                                <h2 className={this.props.isFiltering ? 'filter-active' : ''}>Filter</h2>
                                
                                <Filter isFiltersOpen={this.props.isFiltersOpen} board={this.props.board} />
                            </div>

               <div onClick={() => this.searchInput.focus()} className="search-outer-container flex align-center">
                                <input ref={(input) => { this.searchInput = input; }} placeholder=" Search Tasks" type='text' onChange={this.props.handleSearch} />
                                <GoSearch />
                            </div>
                        {/* MODAL */}
                            {this.props.isModalShown && <section className="modal-screen-wrapper" onClick={this.props.toggleModal}></section>}
                                <button className="flex align-center" onClick={this.props.toggleModal}>
                                    <h3>{this.props.isBoardShown ? 'Board' : 'Dashboard'}</h3> <IoMdArrowDropdown />
                                </button>
            </section>
        )
    }
}
