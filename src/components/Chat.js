import {useContext} from 'react';

import { UserRoomsContext } from '../contexts/UserRooms';
import { SocketContext } from '../contexts/Socket';

import ChatSideBar from './chat/ChatSideBar';
import ChatFrame from './chat/ChatFrame';

const Chat = () => {
    const {socket} = useContext(SocketContext);
    const {rooms, currentChat, setCurrentChat} = useContext(UserRoomsContext);

    return <div style = {{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <ChatSideBar rooms = {rooms} setCurrentChat = {setCurrentChat} />
                <ChatFrame socket = {socket} currentChat = {currentChat} />
            </div>
}

export default Chat;