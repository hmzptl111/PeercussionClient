import {createContext, useContext, useEffect, useState} from 'react';

import { SocketContext } from './Socket';
import {UserAuthStatusContext} from '../contexts/UserAuthStatus';

import axios from 'axios';

export const UserRoomsContext = createContext();

export const UserRoomsProvider = ({children}) => {
    const [rooms, setRooms] = useState([]);
    const [currentChat, setCurrentChat] = useState();

    const {socket} = useContext(SocketContext);

    const {user} = useContext(UserAuthStatusContext);

    useEffect(() => {
        if(!rooms || !socket) return;
        let userRooms = [];
        for(let room of rooms) {
            userRooms.push(room.room);
        }
        
        socket.emit('join', userRooms);
    }, [socket, rooms]);

    useEffect(() => {
        if(!user) return;
        console.log('chat opened');
        const getRooms = async () => {
            const response = await axios.post('/getChatRooms');
            if(response.status === 200) {
                console.log(response.data);
                setRooms(response.data);
            }
        }

        getRooms();
    }, [user]);

    return <UserRoomsContext.Provider value = {{rooms, currentChat, setCurrentChat}}>
            {children}
        </UserRoomsContext.Provider>
}