import React, {useContext} from 'react';
import '../../styles/header/ChatButton.css';
import {ReactComponent as ChatIcon} from '../../images/chat.svg';
import { UserAuthStatusContext } from '../../contexts/UserAuthStatus';

const ChatButton = () => {
    const {isUserSignedIn} = useContext(UserAuthStatusContext);

    return(
            isUserSignedIn &&
            <button className = 'chat-button'>
                <a href = '/chat'>
                    <ChatIcon />
                </a>
            </button>
    );
};

export default ChatButton;