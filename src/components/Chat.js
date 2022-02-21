import '../styles/Chat.css';

import {useContext, useEffect, useState} from 'react';

import { UserRoomsContext } from '../contexts/UserRooms';
import { SocketContext } from '../contexts/Socket';

import ChatSideBar from './chat/ChatSideBar';
import ChatFrame from './chat/ChatFrame';

const Chat = () => {
    const {socket} = useContext(SocketContext);
    const {rooms, currentChat, setCurrentChat} = useContext(UserRoomsContext);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if(isMenuOpen) {
            console.log('side bar opened');
            document.querySelector('.chat-sidebar').classList.add('chat-sidebar-opened');
        } else {
            document.querySelector('.chat-sidebar').classList.remove('chat-sidebar-opened');
            console.log('side bar closed');
        }
    }, [isMenuOpen]);

    return <div className = 'chat'>
                <ChatSideBar rooms = {rooms} currentChat = {currentChat} setCurrentChat = {setCurrentChat} setIsMenuOpen = {setIsMenuOpen} />
                <ChatFrame socket = {socket} currentChat = {currentChat} setIsMenuOpen = {setIsMenuOpen} />
            </div>
}

export default Chat;