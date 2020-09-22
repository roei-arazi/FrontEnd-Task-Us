import React, { Component } from 'react'
import { BsFilePlus } from 'react-icons/bs';
import { RiDeleteBack2Line } from 'react-icons/ri';
import Truncate from 'react-truncate'

export class Tags extends Component {

    state = {

    }

    componentDidMount() {

        this.elTagInput = React.createRef();
        this.elTag = React.createRef();

        this.setState({ tags: JSON.parse(JSON.stringify(this.props.task.tags)) })
    }

    handleChange = (ev, id) => {
        const tags = this.state.tags.map(tag => {
            if (tag.id === id) {
                tag.txt = ev.target.value
            }
            return tag
        })
        this.setState({ tags });
    }

    onAddTag = () => {
        const tags = [...this.state.tags]
        const tagName = this.elTagInput.current.value ? this.elTagInput.current.value : 'New Tag'
        tags.push({ id: this._makeid(), txt: tagName, color: _getRandomColor() })
        this.setState({ tags });
        this.props.onEditTags(tags)
    }

    onRemoveTag = (id) => {
        const tags = this.state.tags.filter(tag => tag.id !== id)
        this.setState({ tags });
        this.props.onEditTags(tags)
    }
    onEditTag = (idx) => {
        console.log('state:', this.state.tags[idx].txt)
        console.log('props:', this.props.task.tags[idx].txt)
        if (this.props.task.tags[idx].txt === this.state.tags[idx].txt) {
            console.log('WIERD...',)
            return
        }
        this.props.onEditTags(this.state.tags)
    }

    focusText = () => {
        setTimeout(() => {
            document.execCommand('selectAll', false, null)
        }, 0)
    }

    _makeid(length = 7) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    render() {
        if (!this.state.tags || this.state.tags === 0) return <h1>no tags</h1>
        return (
            <div onClick={() => this.props.openModal('tags')} className="label-container tags relative">
                <div className="task-label-name">
                    {this.state.tags.map((tag, idx) => {
                        return (
                            <p style={{ color: tag.color }} key={idx}>
                                <Truncate lines={1} ellipsis={"..."} width={100}>
                                    {idx === this.state.tags.length - 1 ? tag.txt : tag.txt + ","}
                                </Truncate>
                            </p>
                        )
                    })}
                </div>

                {this.props.isTagsShown &&
                    <div className="label-list tags-modal absolute flex column align-center">
                        <section>
                            {this.state.tags.map((tag, idx) => {
                                return (
                                    <div className="tag-container flex justify-center align-center" key={tag.id}>
                                        <RiDeleteBack2Line className="tag-remove-icon" onClick={() => this.onRemoveTag(tag.id)} />
                                        <input style={{ color: tag.color }} onBlur={(ev) => {
                                            ev.target.blur()
                                            this.onEditTag(idx)
                                        }}
                                            onKeyDown={(ev) => {
                                                if (ev.key === 'Enter') {
                                                    ev.target.blur()
                                                    this.onEditTag(idx)
                                                }
                                            }}

                                            onChange={(ev) => this.handleChange(ev, tag.id)} value={tag.txt} type="text" />
                                    </div>
                                )
                            })}
                            <div className="tag-add-container flex justify-center align-center">
                                <input ref={this.elTagInput} type="text" />
                                <BsFilePlus onClick={this.onAddTag} />
                            </div>
                        </section>
                    </div>
                }

            </div>
        )
    }
}

function _getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

