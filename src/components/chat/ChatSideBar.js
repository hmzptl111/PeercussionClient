import '../../styles/chat/ChatSideBar.css';

import BackButton from '../reusable/BackButton';
import UserStatusControl from '../reusable/UserStatusControl';

import GeneralProfileIcon from '../reusable/GeneralProfileIcon';
import InitialsIcon from '../reusable/InitialsIcon';

import {ReactComponent as CloseIcon} from '../../images/close.svg';

const ChatSideBar = ({rooms, currentChat, setCurrentChat, setIsMenuOpen}) => {

    const handleCurrentChatChange = (user) => {
        setCurrentChat(user);
        setIsMenuOpen(false);
    }

    return <div className = 'chat-sidebar'>
            <div className = 'chat-sidebar-header'>
                <BackButton />
                <UserStatusControl />
                {
                    <div onClick = {() => setIsMenuOpen(false)} className = 'chat-sidebar-header-close'>
                        <CloseIcon />
                    </div>
                }
            </div>

            <div className = 'chat-sidebar-rooms'>
                {
                    rooms &&
                    rooms.map(u => (
                        <div key = {u.uId} onClick = {() => handleCurrentChatChange(u)} className = {`chat-sidebar-room ${currentChat && 'current-chat-room'}`}>
                            <div className = 'chat-sidebar-room-item'>
                                {
                                    u.uProfilePicture ?
                                    <GeneralProfileIcon imageSource = 'profilePictures' imageID = {u.uProfilePicture} />:
                                    <InitialsIcon initial = {u.uName[0]} isUpperCase = {true} />
                                }
                                <div className = 'chat-sidebar-room-item-text'>{u.uName}</div>
                            </div>
                            <div className = 'chat-sidebar-user-status'>
                                {
                                    u.isUserOnline &&
                                    'Online'
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
}

export default ChatSideBar;