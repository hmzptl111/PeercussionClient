import '../../styles/chat/ChatShare.css';

import { useContext } from 'react';

import { SocketContext } from '../../contexts/Socket';
import { UserStatusContext } from '../../contexts/UserStatus';
import { UserRoomsContext } from '../../contexts/UserRooms';

import Popup from 'react-popup';

const ChatShare = ({post, community, user}) => {
    const {socket} = useContext(SocketContext);
    const {isUserOnline, setIsUserOnline} = useContext(UserStatusContext);
    const {rooms, setCurrentChat} = useContext(UserRoomsContext);

    const handleSharePost = (room) => {
        if(!room) return;

        if(!socket || !isUserOnline) {
            setIsUserOnline(true);
        }

        const date = new Date();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const payload = {
            type: (post && 'post') || (community && 'community') || (user && 'user'),
            time: `${hours}:${minutes}`,
            message: (post && post) || (community && community) || (user && user),
            roomID: room.room
        }
        socket.emit('message', payload, room.room);

        setCurrentChat(room);
        Popup.close();
    }


    return <>
            {
                rooms && rooms.length > 0 ?
                <>
                    <div className = 'chat-share-popup'>
                        {
                            rooms.map(room => {
                                return <div key = {room.room} onClick = {() => handleSharePost(room)} className = 'chat-share-popup-item'>{room.uName}</div>
                            })
                        }
                    </div>
                </>:
                'Either you don\'t have any friends or you\'re offline'
            }

        <Popup />
    </>
}

export default ChatShare;