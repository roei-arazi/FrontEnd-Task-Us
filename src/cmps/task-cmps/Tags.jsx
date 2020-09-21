import React, { Component } from 'react'
import ContentEditable from 'react-contenteditable';
import Truncate from 'react-truncate'

export class Tags extends Component {

    state = {
        txt: ''
    }

    componentDidMount() {
        this.elTag = React.createRef();
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    handleNameChange = (ev) => {
        this.setState({ txt: ev.target.value });
    }

    focusText = () => {
        setTimeout(() => {
            document.execCommand('selectAll', false, null)
        }, 0)
    }

    render() {
        return (
            <h1>tags</h1>
            // <div className="label-container relative">
            //     <div onClick={() => this.props.openModal('tags')} className="tags">
            //         <div className="task-label-name">
            //             {this.props.tags.map((tag, idx) => {
            //                 console.log('tag', tag)
            //                 return (
            //                     <p key={idx}>
            //                         <Truncate lines={1} ellipsis={"..."} width={100}>
            //                             {idx === this.props.tags.length - 1 ? tag.txt : tag.txt + ","}
            //                         </Truncate>
            //                     </p>
            //                 )
            //             })}
            //         </div>

            //         {this.props.isTagsShown &&
            //             <div className="label-list tags-modal absolute flex column align-center">
            //                 <section>
            //                     {this.props.tags.map((tag, idx) => {
            //                         console.log('tag', tag)
            //                         return (
            //                             <React.Fragment>
            //                                 <p key={idx} style={{ color: tag.color }}>
            //                                     <ContentEditable
            //                                         onFocus={this.focusText}
            //                                         className="content-editable cursor-initial"
            //                                         innerRef={this.elTag}
            //                                         html={idx === this.props.tags.length - 1 ? tag.txt : tag.txt + ","} // innerHTML of the editable div
            //                                         disabled={false}       // use true to disable editing
            //                                         onChange={() => this.props.handleChange('tag', this.state.txt)} // handle innerHTML change
            //                                         onBlur={() => {
            //                                             this.props.onEditTask('tag', this.state.txt)
            //                                         }}
            //                                         onKeyDown={(ev) => {
            //                                             if (ev.key === 'Enter') {
            //                                                 ev.target.blur()
            //                                                 this.props.onEditTask('tag', this.state.txt)
            //                                             }
            //                                         }}
            //                                     />
            //                                 </p>
            //                             </React.Fragment>
            //                         )
            //                     })}
            //                 </section>
            //             </div>
            //         }

            //     </div>
            // </div>
        )
    }
}


