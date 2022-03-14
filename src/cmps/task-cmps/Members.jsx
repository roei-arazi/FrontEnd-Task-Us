import { Fade } from '@material-ui/core';
import React from 'react'
import { FiMinus } from 'react-icons/fi'
import { FiPlus } from 'react-icons/fi';

export function Members(props) {
    function _getMemeberInitials(member) {
        let [firstName, lastName] = member.fullName.split(" ")
        let firstNameChar = ''
        let lastNameChar = ''
        if (firstName) firstNameChar = firstName.charAt(0).toUpperCase()
        if (lastName) lastNameChar = lastName.charAt(0).toUpperCase()
        return [firstNameChar, lastNameChar]
    }

    const usersToAdd = props.users.filter(user => !props.members.some(member => member._id === user._id))
    const {modalPosition, isAuth} = props;
    
    return (
        <div className="user-img-container relative flex justify-center align-center"  onClick={(ev) => {
            if(!isAuth) return
            props.openModal('users', ev)
        } }>
            {props.members.length ? <div className="member-img-container flex relative ">
                {props.members.map((member, idx) => {
                    if (idx > 1) return <div key={member._id} className="task-number-of-members">
                        <span>{props.members.length > 9 ? '+9' : `+${props.members.length - 2}`}</span>
                    </div>
                    return member.imgUrl ?
                        <img key={member._id} className="member-img" src={member.imgUrl} alt="" />
                        :
                        <div key={member._id} className="member-letter ">
                            {_getMemeberInitials(member)[0]}
                            {_getMemeberInitials(member)[1]}
                        </div>
                })
                }
                {props.members.length < 3 && <FiPlus className="no-members-icon-plus absolute" />}

            </div>
                :
                <div className="no-members-container">
                    <img src="https://img.icons8.com/external-becris-flat-becris/64/000000/external-user-avatars-becris-flat-becris-1.png" alt="" className="no-members-icon" />
                    <FiPlus className="no-members-icon-plus" />
                </div>}
            <Fade in={props.isUsersShown} >
                <div onClick={ (ev) =>
                      ev.stopPropagation()
                }  style={{...modalPosition}} className="users-modal modal-fade-in fixed">
                    <div className="task-users-box"> 
                        <h3>Task Members</h3>
                        {props.members.map((member, idx) =>
                            <section key={idx} className="user-box flex space-between align-center">
                                <div className="user-box-info flex align-center" onClick={() => props.goToUserProfile(member._id)}>
                                    {member.imgUrl ? <img src={member.imgUrl} alt="profile" /> : <div className="member-letter">
                                        {_getMemeberInitials(member)[0]}
                                        {_getMemeberInitials(member)[1]}
                                    </div>}
                                    <p className="member-name">{member.fullName}</p>
                                </div>
                                <FiMinus onClick={() => props.onRemoveMemberFromTask(member._id)} />
                            </section>
                        )}
                    </div>
                    <div className="board-users-box">
                        <h3>Board Members</h3>
                        {usersToAdd.map((user, idx) => {
                            return <section key={idx} className="user-box flex space-between align-center">
                                <div className="user-box-info flex  align-center" onClick={() => props.goToUserProfile(user._id)}>
                                    {user.imgUrl ? <img src={user.imgUrl} alt="profile" /> :
                                        <div className="member-letter">
                                            {_getMemeberInitials(user)[0]}
                                            {_getMemeberInitials(user)[1]}
                                        </div>}
                                    <p className="member-name">{user.fullName}</p>
                                </div>
                                <FiPlus onClick={() => props.onAddUserToTask(user._id)} />
                            </section>
                        })}
                    </div>
                </div>
            </Fade>
        </div>
    )
}