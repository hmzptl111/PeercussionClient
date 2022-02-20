import { useContext } from "react"
import {useHistory} from 'react-router-dom';

import { SocketContext } from "../../contexts/Socket"
import { UserStatusContext } from "../../contexts/UserStatus";
import { UserRoomsContext } from "../../contexts/UserRooms";

const ChatShare = ({post, community, user}) => {
    const {socket} = useContext(SocketContext);
    const {isUserOnline, setIsUserOnline} = useContext(UserStatusContext);
    const {rooms, setCurrentChat} = useContext(UserRoomsContext);

    let history = useHistory();

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
        history.push('/chat');
    }


    return <div>
            {
                rooms && rooms.length > 0 ?
                <>
                    <ul style = {{listStyleType: 'none'}}>
                        {
                            rooms.map(room => {
                                return <li key = {room.room} onClick = {() => handleSharePost(room)} style = {{cursor: 'pointer'}}>{room.uName}</li>
                            })
                        }
                    </ul>
                </>:
                'Either you don\'t have any friends or you\'re offline'
            }
    </div>
}

export default ChatShare;