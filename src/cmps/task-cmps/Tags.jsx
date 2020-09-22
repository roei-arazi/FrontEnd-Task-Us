import React, { Component } from 'react'
import { BsFilePlus } from 'react-icons/bs';
import { RiDeleteBack2Line } from 'react-icons/ri';
import Truncate from 'react-truncate'

export class Tags extends Component {

    state = {

    }

    componentDidMount() {
        console.log('HELO?!@#!?@', this.props.task.tags)

        this.elTag = React.createRef();

        this.setState({ tags: this.props.task.tags })
    }

    handleNameChange = (ev, id) => {
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
        tags.push({ id: this._makeid(), txt: "New tag", color: "coral" })
        this.setState({ tags });
        this.props.onEditTags(tags)
    }
    onRemoveTag = (id) => {
        const tags = this.state.tags.filter(tag => tag.id !== id)
        this.setState({ tags });
        this.props.onEditTags(tags)
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
                            {this.state.tags.map((tag) => {
                                return (
                                    <div className="tag-container flex justify-center align-center" key={tag.id}>
                                        <RiDeleteBack2Line onClick={() => this.onRemoveTag(tag.id)} />
                                        <input style={{ color: tag.color }} onBlur={(ev) => {
                                            ev.target.blur()
                                            this.props.onEditTags(this.state.tags)
                                        }}
                                            onKeyDown={(ev) => {
                                                if (ev.key === 'Enter') {
                                                    ev.target.blur()
                                                    this.props.onEditTags(this.state.tags)
                                                }
                                            }}

                                            onChange={(ev) => this.handleNameChange(ev, tag.id)} value={tag.txt} type="text" />
                                    </div>
                                )
                            })}
                            <BsFilePlus onClick={this.onAddTag} />
                        </section>
                    </div>
                }

            </div>
        )
    }
}


