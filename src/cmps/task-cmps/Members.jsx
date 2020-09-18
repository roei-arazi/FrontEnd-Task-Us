import React from 'react'

export function Members(props) {
    const usersToAdd = props.users.filter(user => !props.members.some(member => member._id === user._id))
    return (
        <div className="user-img-container relative" onClick={() => props.openModal('users')}>

            {props.members.length ? props.members[0].imgUrl ? <img alt="profile" src={props.members[0].imgUrl} /> :
                <div className="member-letter">{props.members[0].fullName.charAt(0).toUpperCase()}</div> : <div className="member-letter">0</div>}
            <div className="task-number-of-imgs"><span>+{props.members.length ? props.members.length : 0}</span></div>
            {props.isUsersShown &&
                <div className="users-modal absolute">
                    <div className="task-users-box">
                        <h3>Task Members</h3>
                        {props.members.map(member =>
                            <section key={member._id} className="user-box flex space-between">
                                <div className="user-box-info flex  align-center" onClick={() => props.goToUserProfile(member._id)}>
                                    {member.imgUrl ? <img src={member.imgUrl} alt="profile" /> : <div className="member-letter">{member.fullName.charAt(0).toUpperCase()}</div>}
                                    <p>{member.fullName}</p>
                                </div>
                                <button onClick={() => props.onRemoveMemberFromTask(member._id)}>Remove</button>
                            </section>
                        )}
                    </div>
                    <div className="board-users-box">
                        <h3>Board Members</h3>
                        {usersToAdd.map(user => {
                            return <section key={user._id} className="user-box flex space-between">
                                <div className="user-box-info flex  align-center" onClick={() => props.goToUserProfile(user._id)}>
                                    {user.imgUrl ? <img src={user.imgUrl} alt="profile" /> :
                                        <div className="member-letter">{user.fullName.charAt(0).toUpperCase()}</div>}
                                    <p>{user.fullName}</p>
                                </div>
                                <button onClick={() => props.onAddUserToTask(user._id)}>Add</button>
                            </section>
                        })}
                    </div>

                </div>}
        </div>
    )
}