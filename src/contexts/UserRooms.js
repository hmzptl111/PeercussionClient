import { createContext, useContext, useEffect, useState } from 'react';

import { SocketContext } from './Socket';
import { UserStatusContext } from './UserStatus';
import { UserAuthStatusContext } from './UserAuthStatus';

import axios from 'axios';

import {PopUp, PopUpQueue} from '../components/reusable/PopUp';

export const UserRoomsContext = createContext();


export const UserRoomsProvider = ({children}) => {
    const [rooms, setRooms] = useState([]);
    const [currentChat, setCurrentChat] = useState();

    const {isUserOnline} = useContext(UserStatusContext);
    const {socket} = useContext(SocketContext);
    const {user} = useContext(UserAuthStatusContext);

    const getRooms = async () => {
        const response = await axios.post('/getChatRooms');

        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        setRooms(response.data.message);

        if(response.data.message) {
            setCurrentChat(response.data.message[0]);
        }
    }

    useEffect(() => {
        if(!rooms) return;

        if(!isUserOnline) {
            setRooms(rooms => {
                let updatedRooms = rooms;
                for(let i = 0; i < updatedRooms.length; i++) {
                    updatedRooms[i].isUserOnline = false;
                }
                return updatedRooms;
            });
            return;
        }

        getRooms();
        //eslint-disable-next-line
    }, [isUserOnline]);

    useEffect(() => {
        if(!socket) return;

        socket.on('status', status => {
            setRooms(rooms => {
                let updatedRooms = [...rooms];
                for(let i = 0; i < updatedRooms.length; i++) {
                    if(updatedRooms[i].uId === status.uId) {
                        updatedRooms[i].isUserOnline = status.isUserOnline;
                    }
                }
                return updatedRooms;
            });
        });
    }, [socket]);

    useEffect(() => {
        if(!rooms || !socket) return;

        let userRooms = [];
        for(let room of rooms) {
            userRooms.push(room.room);
        }
        
        socket.emit('join', userRooms);
    }, [socket, rooms]);

    useEffect(() => {
        if(!user || !isUserOnline) return;

        getRooms();
        //eslint-disable-next-line
    }, [user]);

    return <UserRoomsContext.Provider value = {{rooms, setRooms, currentChat, setCurrentChat}}>
    { children }
</UserRoomsContext.Provider>
}