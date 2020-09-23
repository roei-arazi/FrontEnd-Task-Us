import React from 'react'
import { CgProfile } from 'react-icons/cg'
import { AiOutlineMinus } from 'react-icons/ai'
import { FiPlus } from 'react-icons/fi';

export function Members(props) {
    const usersToAdd = props.users.filter(user => !props.members.some(member => member._id === user._id))
    return (

        <div className="user-img-container relative flex justify-center align-center" onClick={() => props.openModal('users')}>
            {props.members.length ? props.members[0].imgUrl
                ?
                <img alt="profile" src={props.members[0].imgUrl} />
                :
                <div className="member-letter">{props.members[0].fullName.charAt(0).toUpperCase()}</div> : <div className="no-members-container"> <CgProfile className="no-members-icon" /> <FiPlus className="no-members-icon-plus" /></div>}

            {(props.members.length !== 0) &&
                <div className="task-number-of-imgs flex justify-center align-center"><span>{props.members.length}</span></div>}

            {props.isUsersShown &&
                <div className="users-modal absolute">
                    <div className="task-users-box">
                        <h3>Task Members</h3>
                        {props.members.map((member,idx) =>
                            <section key={idx} className="user-box flex space-between align-center">
                                <div className="user-box-info flex align-center" onClick={() => props.goToUserProfile(member._id)}>
                                    {member.imgUrl ? <img src={member.imgUrl} alt="profile" /> : <div className="member-letter">{member.fullName.charAt(0).toUpperCase()}</div>}
                                    <p className="member-name">{member.fullName}</p>
                                </div>
                                <AiOutlineMinus onClick={() => props.onRemoveMemberFromTask(member._id)} />
                            </section>
                        )}

                    </div>
                    <div className="board-users-box">
                        <h3>Board Members</h3>
                        {usersToAdd.map((user,idx) => {
                            return <section key={idx} className="user-box flex space-between align-center">
                                <div className="user-box-info flex  align-center" onClick={() => props.goToUserProfile(user._id)}>
                                    {user.imgUrl ? <img src={user.imgUrl} alt="profile" /> :
                                        <div className="member-letter">{user.fullName.charAt(0).toUpperCase()}</div>}
                                    <p className="member-name">{user.fullName}</p>
                                </div>
                                <FiPlus onClick={() => props.onAddUserToTask(user._id)} />
                            </section>
                        })}
                    </div>

                </div>}
        </div>
    )
}