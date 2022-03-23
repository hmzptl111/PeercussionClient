import { createContext, useContext, useEffect, useState } from 'react';

import {io} from 'socket.io-client';

import { UserStatusContext } from './UserStatus';
import { UserAuthStatusContext } from './UserAuthStatus';

export const SocketContext = createContext();


export const SocketProvider = ({children}) => {
    const [socket, setSocket] = useState();

    const {isUserOnline} = useContext(UserStatusContext);
    const {isUserSignedIn, user} = useContext(UserAuthStatusContext);

    // useEffect(() => {
    //     if(!socket) return;

    //     socket.on('connect', () => {
    //         console.log(socket.id);
    //     });
            
    //     socket.on('disconnect', () => {
    //         console.log(`${socket.id}, connection disconnected`);
    //     });
    // }, [socket]);

    useEffect(() => {       
        if(!user || !isUserSignedIn) return;

        if(isUserOnline) {
            //do not replace localhost to host ip address, for some reason, it does not work
            const response = io('http://localhost:3001/', {
                transports : ['websocket', 'polling', 'flashsocket']
            });

            setSocket(response);
        } else {
            if(!socket) return;

            socket.disconnect();
            setSocket(null);
        }
        //eslint-disable-next-line
    }, [user, isUserSignedIn, isUserOnline]);
    

    return <SocketContext.Provider value = {{socket, setSocket}}>
    {children}
</SocketContext.Provider>
}