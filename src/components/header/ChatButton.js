import '../../styles/header/ChatButton.css';

import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { UserAuthStatusContext } from '../../contexts/UserAuthStatus';

import {ReactComponent as ChatIcon} from '../../images/chat.svg';
import {ReactComponent as ChatIconSmall} from '../../images/chat_small.svg';


const ChatButton = ({isSmall = false}) => {
    const {isUserSignedIn} = useContext(UserAuthStatusContext);

    return isUserSignedIn &&
    <Link to = '/chat' className = 'chat-button'>
        {
            isSmall ?
            <ChatIconSmall />:
            <ChatIcon />
        }
    </Link>
};

export default ChatButton;