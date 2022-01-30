import { createContext, useContext, useEffect, useState } from "react";

import {io} from 'socket.io-client';

import { UserStatusContext } from "./UserStatus";
import { UserAuthStatusContext } from "./UserAuthStatus";

export const SocketContext = createContext();

export const SocketProvider = ({children}) => {
    const [socket, setSocket] = useState();
    const {isUserOnline} = useContext(UserStatusContext);
    const {user} = useContext(UserAuthStatusContext);

    useEffect(() => {
        if(!socket) return;

        socket.on("connect", () => {
            console.log(socket.id);
        });
            
        socket.on("disconnect", () => {
            console.log(`${socket.id}, connection disconnected`);
        });
    }, [socket]);

    useEffect(() => {       
        if(!user) return; 
        if(isUserOnline) {
            const query = {
                uId: user.uId,
                uName: user.uName
            }
            const response = io('http://localhost:3001/', {
                transports : ['websocket', 'polling', 'flashsocket'],
                query: query
            });
            console.log(response);
            setSocket(response);
        } else {
            if(!socket) return;
            socket.disconnect();
            setSocket(null);
        }

        //eslint-disable-next-line
    }, [user, isUserOnline]);
    

    return (
            <SocketContext.Provider value = {{socket}}>
                {children}
            </SocketContext.Provider>
    );
}