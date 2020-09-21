import React from 'react'
import Truncate from 'react-truncate'


export function Tags(props) {

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    return (
        <div className="label-container relative">
            <div onClick={() => props.openModal('tags')} className="tags">
                <div className="task-label-name">
                    {props.tags.map((tag, idx) => {
                        return (
                            <p key={idx}>
                                <Truncate lines={1} ellipsis={"..."} width={100}>
                                    {idx === props.tags.length - 1 ? tag : tag + ","}
                                </Truncate>
                            </p>
                        )
                    })}
                </div>

                {props.isTagsShown &&
                    <div className="label-list tags-modal absolute flex column align-center">
                        <section>
                            {props.tags.map((tag, idx) => {
                                return (
                                    <p key={idx} style={{ color: tag.color }}> {idx === props.tags.length - 1 ? tag : tag + ","}</p>
                                )
                            })}
                        </section>
                    </div>
                }

            </div>
        </div>
    )
}