import React from 'react';
import { BiAddToQueue } from 'react-icons/bi'
import { Tooltip, Zoom } from '@material-ui/core';
import ContentEditable from 'react-contenteditable';


export class BoardHeader extends React.Component{
    
    state={
        _id:''
    }
    

    componentDidMount(){
        this.editableName = React.createRef();
        this.editableDescription = React.createRef();

        this.setState({...this.props.board})
    }

    // componentDidUpdate(prevProps, prevState){
    //     if(prevProps.match.params.id === this.props.match.params.id){
    //         this.setState({...this.props.board})
    //     }
    // }

    handleChangeName=(ev)=>{
        console.log(ev.target.value);
       this.setState({name:ev.target.value})
    }

    handleChangeDesc=(ev)=>{
       this.setState({description:ev.target.value})
    }

    render(){
        if(!this.state._id) return <h1>Loading...</h1>
        return (
            <section className="board-header align-center padding-x-30 padding-y-30 ">
                <div className="col flex column">
                <h1>
                    <ContentEditable
                                className="cursor-initial"
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
                                className="cursor-initial"
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
    
                </div>
            </section>
        )
    }

}