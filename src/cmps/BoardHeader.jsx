import React from 'react';
import { BiAddToQueue } from 'react-icons/bi'
import { Tooltip, Zoom } from '@material-ui/core';
import ContentEditable from 'react-contenteditable';


export function BoardHeader(props) {
    const elBoardName= props.board.name
    const contentEditable = React.createRef();
    return (
        <section className="board-header align-center padding-x-30 padding-y-30 ">
            <div className="col flex column">
            <ContentEditable
                            className="cursor-initial"
                            innerRef={contentEditable}
                            html={elBoardName} // innerHTML of the editable div
                            disabled={false}       // use true to disable editing
                            onChange={props.handleChange} // handle innerHTML change
                            onBlur={() => {
                                props.onEditBoard(props.board)
                            }}
                        />
                <h1>Board header</h1>
                <p>Change board's description</p>
            </div>
            <div className="col flex align-center">
                <Tooltip enterDelay={200} TransitionComponent={Zoom} title="Add Group" arrow>
                    <div className='icon-container'>
                        <BiAddToQueue onClick={props.onAddGroup} />
                    </div>
                </Tooltip>

            </div>
        </section>
    )
}