import { useContext } from "react"
import {useHistory} from 'react-router-dom';

import { SocketContext } from "../../contexts/Socket"
import { UserStatusContext } from "../../contexts/UserStatus";
import { UserRoomsContext } from "../../contexts/UserRooms";

const ChatShare = ({pId, pTitle, pThumbnail, uName, pCName, cName}) => {
    const {socket} = useContext(SocketContext);
    const {isUserOnline, setIsUserOnline} = useContext(UserStatusContext);
    const {rooms, setCurrentChat} = useContext(UserRoomsContext);

    let history = useHistory();

    const handleSharePost = (room) => {
        if(!socket || !isUserOnline) {
            setIsUserOnline(true);
        }

        const date = new Date();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const postShareBody = {
            pId: pId,
            pTitle: pTitle,
            pThumbnail: pThumbnail,
            uName: uName,
            cName: pCName
        }

        const payload = {
            type: pId ? 'post' : 'community',
            time: `${hours}:${minutes}`,
            message: pId ? postShareBody : cName,
            roomID: room.room
        }
        socket.emit('message', payload, room.room);

        setCurrentChat(room);
        history.push('/chat');
    }


    return <div>
            {
                rooms.length > 0 ?
                <>
                    <div>Share {pId ? 'post' : 'community'} to</div>
                    <ul style = {{listStyleType: 'none', marginTop: '1em'}}>
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