import { useContext, useEffect, useState } from "react"

import { UserRoomsContext } from "../../contexts/UserRooms";
import { UserAuthStatusContext } from "../../contexts/UserAuthStatus";
import { SocketContext } from "../../contexts/Socket";

import GeneralProfileIcon from "../reusable/GeneralProfileIcon";
import InitialsIcon from "../reusable/InitialsIcon";

import axios from 'axios';

const ChatFrame = () => {
    const {currentChat} = useContext(UserRoomsContext);
    const [isCurrentChatUserOnline, setIsCurrentChatUserOnline] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const {socket} = useContext(SocketContext);
    const {user} = useContext(UserAuthStatusContext);

    useEffect(() => {
        console.log(messages);
    }, [messages]);

    useEffect(() => {
        if(!user || !socket) return;
        console.log(user);
        console.log(socket);

        socket.once('message', message => {
            console.log(message);
            setMessages(previousState => {
                return [...previousState, message];
            });
        });

        socket.on('user-status', (status) => {
            console.log(status);
            setIsCurrentChatUserOnline(status);
        });
    }, [user, socket]);

    useEffect(() => {
        if(!socket || !currentChat) return;

        //
        socket.emit('check-user-status', currentChat.uId);
        //

        console.log(currentChat);
        const getChats = async () => {
            const response = await axios.post('/getChats', {roomID: currentChat.room});
            if(response.status === 200) {
                setMessages(response.data);
            }
        }

        getChats();
        //eslint-disable-next-line
    }, [socket, currentChat]);

    const handleMessageTextChange = e => {
        setMessageText(e.target.value);
    }

    const handleMessageSend = () => {
        const date = new Date();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        const payload = {
            type: 'text',
            time: `${hours}:${minutes}`,
            message: messageText,
            roomID: currentChat.room
        }

        const tempPayload = payload;
        tempPayload.sender = user.uName;

        setMessages(previousState => {
            return [...previousState, tempPayload];
        });

        socket.emit('message', payload, currentChat.room);
        setMessageText('');
    }

    const handleEnterKey = e => {
        if(e.keyCode === 13) handleMessageSend();
    }

    return (
        user && socket && currentChat ?
        <div style = {{width: '70%'}}>
            {
                <div style = {{height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'space-between', border: '1px solid black'}}>
                    <div style = {{width: '100%', border: '1px solid black', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div style = {{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            {
                                currentChat &&
                                (
                                    currentChat.uProfilePicture ?
                                    <GeneralProfileIcon imageSource = 'profilePictures' imageID =       {currentChat.uProfilePicture} />:
                                    <InitialsIcon initial = {currentChat.uName[0]} isUpperCase = {true} />
                                )
                            }
                            
                            {currentChat.uName}
                        </div>

                        <div>
                            {
                                isCurrentChatUserOnline ?
                                'Online':
                                'Offline'
                            }
                        </div>
                    </div>
                    
                    <div style = {{display: 'flex', flexGrow: '1', flexDirection: 'column', overflowY: 'scroll', border: '1px solid black'}}>
                        {
                            // messages &&
                            // (
                                messages ?
                                messages.map((m, i) => {
                                    return <div key = {i} style = {{display: 'flex', flexDirection: 'column', justifyTracks: 'center', alignItems: m.sender === user.uName ? 'flex-end': 'flex-start', border: '1px solid black'}}>
                                            <div style = {{border: '1px solid black', maxWidth: '50%', wordWrap: 'break-word'}}>
                                                <sup style = {{fontSize: '0.75em'}}>{m.time}</sup>
                                                <div>{m.message}</div>
                                            </div>
                                    </div>
                                }):
                                'Why so empty, say hi'
                            // )
                        }
                    </div>

                    <div style = {{width: '100%', border: '1px solid black', display: 'flex'}}>
                        <input type = 'text' value = {messageText} onChange = {handleMessageTextChange} onKeyDown = {handleEnterKey} style = {{display: 'flex', flexGrow: '10'}} />
            
                        <button style = {{display: 'flex', flexGrow: '1', justifyContent: 'center', alignItems: 'center'}} onClick = {handleMessageSend}>Send</button>
                    </div>
                </div>
            }

        </div>:
        <div>
            Please select a user to chat with
        </div>
    );
}

export default ChatFrame;