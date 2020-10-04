import React, { Component } from 'react'
import { GoSearch } from 'react-icons/go';
import { IoMdArrowDropdown } from 'react-icons/io';
import {Filter} from './Filter'

export  class BoardHeaderModal extends Component {

    state = {

    }

componentDidMount() {
    this.searchInput = React.createRef();
}
    render() {
        return (
            <div>
               <Filter isFiltersOpen={this.props.isFilterOpen} board={this.props.board} /> 
               <div onClick={() => this.searchInput.focus()} className="search-outer-container flex align-center">
                                <input ref={(input) => { this.searchInput = input; }} placeholder=" Search Tasks" type='text' onChange={this.props.handleSearch} />
                                <GoSearch />
                            </div>
                            {this.props.isModalShown && <div className="modal-screen-wrapper" onClick={this.props.toggleModal}></div>}
                                <button className="flex align-center" onClick={this.props.toggleModal}>
                                    <h3>{this.props.isBoardShown ? 'Board' : 'Dashboard'}</h3> <IoMdArrowDropdown />
                                </button>
            </div>
        )
    }
}
