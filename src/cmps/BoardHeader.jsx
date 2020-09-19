import React from 'react';
import { BiAddToQueue } from 'react-icons/bi'
import { Tooltip, Zoom } from '@material-ui/core';
import ContentEditable from 'react-contenteditable';
import Activities from './Activities';
import { Filter } from './Filter';


export class BoardHeader extends React.Component {

    state = {
        _id: '',
        isActivitiesOpen: false,
        isFiltersOpen: false
    }

    componentDidMount() {
        this.editableName = React.createRef();
        this.editableDescription = React.createRef();

        this.setState({ ...this.props.board })
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('prev props:', prevProps);
        if (prevProps.board._id !== this.props.board._id) {
            this.setState({ ...this.props.board })
        }
    }

    handleChangeName = (ev) => {
        console.log(ev.target.value);
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

    onToggleFilters =()=>{
        this.setState({isFiltersOpen: !this.state.isFiltersOpen})
    }

    render() {

        if (!this.state._id) return <h1>Loading...</h1>
        return (
            <section className="board-header align-center padding-x-30 padding-y-30 ">
                <div className="col flex column">
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
                <div className="col flex align-center">
                    <Tooltip enterDelay={200} TransitionComponent={Zoom} title="Add Group" arrow>
                        <div className='icon-container'>
                            <BiAddToQueue onClick={this.props.onAddGroup} />
                        </div>
                    </Tooltip>
                    <button onClick={this.onToggleActivities}>ACTIVITIES</button>

                    <div className="filters-container relative">
                    <button onClick={this.onToggleFilters}>Filters</button>
                {this.state.isFiltersOpen && <Filter board={this.props.board} />}
                    </div>
                </div>
                {this.state.isFiltersOpen && <div onClick={this.onToggleFilters} className='modal-screen-wrapper'></div>}
                
                {
                    this.state.isActivitiesOpen && <div onClick={this.onToggleActivities} className='modal-screen-wrapper'></div>

                }
                <div className={`${this.state.isActivitiesOpen && 'animate-side-modal'} side-modal`}>
                    <Activities board={this.props.board} />
                </div>
            </section>
        )
    }

}