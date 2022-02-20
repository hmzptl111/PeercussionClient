import React, {useContext} from 'react';
import '../../styles/header/ChatButton.css';
import {ReactComponent as ChatIcon} from '../../images/chat.svg';
import {ReactComponent as ChatIconSmall} from '../../images/chat_small.svg';
import { UserAuthStatusContext } from '../../contexts/UserAuthStatus';

import { Link } from 'react-router-dom';

const ChatButton = ({isSmall = false}) => {
    const {isUserSignedIn} = useContext(UserAuthStatusContext);

    return(
            isUserSignedIn &&
            <Link to = '/chat' className = 'chat-button'>
                {
                    isSmall ?
                    <ChatIconSmall />:
                    <ChatIcon />
                }
            </Link>
    );
};

export default ChatButton;