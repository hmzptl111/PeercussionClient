import { useContext, useEffect, useRef, useState } from "react"

import { UserRoomsContext } from "../../contexts/UserRooms";
import { UserAuthStatusContext } from "../../contexts/UserAuthStatus";
import { SocketContext } from "../../contexts/Socket";

import GeneralProfileIcon from "../reusable/GeneralProfileIcon";
import InitialsIcon from "../reusable/InitialsIcon";

import axios from 'axios';

import {Link} from 'react-router-dom';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../reusable/PopUp';

const ChatFrame = () => {
    const {currentChat} = useContext(UserRoomsContext);
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const {socket} = useContext(SocketContext);
    const {user} = useContext(UserAuthStatusContext);

    const lastMessageRef = useRef();

    useEffect(() => {
        console.log(messages);
        if(!lastMessageRef.current) return;
        
        lastMessageRef.current.scrollIntoView();
    }, [messages]);

    useEffect(() => {
        if(!user || !socket) return;
        console.log(user);
        console.log(socket);

        socket.once('message', async (message) => {
            console.log(message);
            
            setMessages(previousState => {
                return [...previousState, message];
            });
        });
    }, [user, socket]);

    useEffect(() => {
        if(!socket || !currentChat) return;

        console.log(currentChat);
        const getChats = async () => {
            const response = await axios.post('/getChats', {roomID: currentChat.room});
            if(response.data.error) {
                let errorPopup = PopUp('Something went wrong', response.data.error);
                PopUpQueue(errorPopup);
                return;
            }
            setMessages(response.data.message);
        }

        getChats();
        //eslint-disable-next-line
    }, [socket, currentChat]);

    const handleMessageTextChange = e => {
        setMessageText(e.target.value);
    }

    const handleMessageSend = () => {
        if(messageText === '') return;

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

    

    const handleShareFile = e => {
        if(!e.target.files[0]) return;
        if(!socket) return;

        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        
        reader.onload = () => {
            const date = new Date();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');

            const image = reader.result;

            const payload = {
                type: 'image',
                time: `${hours}:${minutes}`,
                message: image,
                roomID: currentChat.room
            }

            const tempPayload = payload;
            tempPayload.sender = user.uName;

            setMessages(previousState => {
                return [...previousState, tempPayload];
            });

            console.log(reader.result);
            socket.emit('message', payload, currentChat.room);
        };

        reader.onerror = (error) => {
          console.log('Error: ', error);
        };        
    }

    return (
        user && currentChat ?
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
                                currentChat.isUserOnline &&
                                'Online'
                            }
                        </div>
                    </div>
                    
                    <div style = {{display: 'flex', flexGrow: '1', flexDirection: 'column', overflowY: 'scroll', border: '1px solid black'}}>
                        {
                            messages ?
                            messages.map((m, i) => {
                                if(messages.length === i + 1) {
                                    return <>
                                        {
                                            m.type === 'text' &&
                                            <div key = {i} style = {{display: 'flex', flexDirection: 'column', justifyTracks: 'center', alignItems: m.sender === user.uName ? 'flex-end': 'flex-start', border: '1px solid black'}} ref = {lastMessageRef}>
                                                <div style = {{border: '1px solid black', maxWidth: '50%', wordWrap: 'break-word'}}>
                                                    <sup style = {{fontSize: '0.75em', display: 'flex', justifyContent: m.sender === user.uName ? 'flex-end': 'flex-start', alignItems: 'center'}}>{m.time}</sup>
                                                    <div>{m.message}</div>
                                                </div>
                                            </div>
                                        }
                                        {
                                            m.type === 'image' &&
                                            <div key = {i} style = {{display: 'flex', flexDirection: 'column', justifyTracks: 'center', alignItems: m.sender === user.uName ? 'flex-end': 'flex-start', border: '1px solid black'}} ref = {lastMessageRef}>
                                                <div style = {{border: '1px solid black', maxWidth: '50%', wordWrap: 'break-word'}}>
                                                    <sup style = {{fontSize: '0.75em', display: 'flex', justifyContent: m.sender === user.uName ? 'flex-end': 'flex-start', alignItems: 'center'}}>{m.time}</sup>
                                                    <div>
                                                        {
                                                            <img src = {m.message} alt = '' height = '300' width = '100%' />
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {
                                            m.type === 'post' &&
                                            <div key = {i} style = {{display: 'flex', flexDirection: 'column', justifyTracks: 'center', alignItems: m.sender === user.uName ? 'flex-end': 'flex-start', border: '1px solid black'}} ref = {lastMessageRef}>
                                                <Link to = {`/p/${m.message.pId}`} style = {{border: '1px solid black', width: '50%'}}>
                                                    <sup style = {{fontSize: '0.75em', display: 'flex', justifyContent: m.sender === user.uName ? 'flex-end': 'flex-start', alignItems: 'center'}}>{m.time}</sup>
                                                    <div style = {{maxWidth: '100%'}}>
                                                        <div style = {{display: 'flex', flexDirection: 'column'}}>
                                                            <div style = {{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                                <div>{m.message.uName}</div>
                                                                <div>{`c/${m.message.cName}`}</div>
                                                            </div>
                                                            <div style = {{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
                                                                {
                                                                    m.message.pTitle
                                                                }
                                                            </div>
                                                        </div>
                                                        {
                                                            m.message.pThumbnail &&
                                                            <div>
                                                                {
                                                                    m.message.pThumbnail &&
                                                                    <img src = {m.message.pThumbnail} alt = '' height = '300' width = '100%' />
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                                </Link>
                                            </div>
                                        }
                                        {
                                            m.type === 'community' &&
                                            <div key = {i} style = {{display: 'flex', flexDirection: 'column', justifyTracks: 'center', alignItems: m.sender === user.uName ? 'flex-end': 'flex-start', border: '1px solid black'}} ref = {lastMessageRef}>
                                                <div style = {{border: '1px solid black', maxWidth: '50%', wordWrap: 'break-word'}}>
                                                    <Link to = {`c/${m.message.cName}`} style = {{border: '1px solid black', width: '50%'}}>
                                                        <sup style = {{fontSize: '0.75em', display: 'flex', justifyContent: m.sender === user.uName ? 'flex-end': 'flex-start', alignItems: 'center'}}>{m.time}</sup>
                                                        <div style = {{maxWidth: '100%'}}>
                                                            <div style = {{display: 'flex', justifyContent: 'center', alignItems: m.sender === user.uName ? 'flex-end': 'flex-start', flexDirection: 'column'}}>
                                                            {/* <div>{m.message.uName}</div> */}
                                                                <div>Follow {`c/${m.message.cName}`}</div>
                                                            
                                                            {
                                                                m.message.cThumbnail &&
                                                                <div>
                                                                    <img src = {`/uploads/communityThumbnails/${m.message.cThumbnail}`} alt = '' height = '300' width = '100%' />
                                                                </div>
                                                            }
                                                        </div>
                                                        </div>
                                                    </Link>
                                                    
                                                </div>
                                            </div>
                                        }
                                        {
                                            m.type === 'user' &&
                                            <div key = {i} style = {{display: 'flex', flexDirection: 'column', justifyTracks: 'center', alignItems: m.sender === user.uName ? 'flex-end': 'flex-start', border: '1px solid black'}} ref = {lastMessageRef}>
                                                <div style = {{border: '1px solid black', maxWidth: '50%', wordWrap: 'break-word'}}>
                                                    <Link to = {`u/${m.message.uName}`} style = {{border: '1px solid black', width: '50%'}}>
                                                        <sup style = {{fontSize: '0.75em', display: 'flex', justifyContent: m.sender === user.uName ? 'flex-end': 'flex-start', alignItems: 'center'}}>{m.time}</sup>
                                                        <div style = {{maxWidth: '100%'}}>
                                                            <div style = {{display: 'flex', justifyContent: 'center', alignItems: m.sender === user.uName ? 'flex-end': 'flex-start', flexDirection: 'column'}}>
                                                                <div>Follow {`u/${m.message.uName}`}</div>
                                                            
                                                                {
                                                                    m.message.uProfilePicture &&
                                                                    <div>
                                                                        <img src = {`/uploads/profilePictures/${m.message.uProfilePicture}`} alt = '' height = '300' width = '100%' />
                                                                    </div>
                                                                }
                                                        </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        }
                                    </>
                                } else {
                                    return <>
                                        {
                                            m.type === 'text' &&
                                            <div key = {i} style = {{display: 'flex', flexDirection: 'column', justifyTracks: 'center', alignItems: m.sender === user.uName ? 'flex-end': 'flex-start', border: '1px solid black'}}>
                                                <div style = {{border: '1px solid black', maxWidth: '50%', wordWrap: 'break-word'}}>
                                                    <sup style = {{fontSize: '0.75em', display: 'flex', justifyContent: m.sender === user.uName ? 'flex-end': 'flex-start', alignItems: 'center'}}>{m.time}</sup>
                                                    <div>{m.message}</div>
                                                </div>
                                            </div>
                                        }
                                        {
                                            m.type === 'image' &&
                                            <div key = {i} style = {{display: 'flex', flexDirection: 'column', justifyTracks: 'center', alignItems: m.sender === user.uName ? 'flex-end': 'flex-start', border: '1px solid black'}}>
                                                <div style = {{border: '1px solid black', maxWidth: '50%', wordWrap: 'break-word'}}>
                                                    <sup style = {{fontSize: '0.75em', display: 'flex', justifyContent: m.sender === user.uName ? 'flex-end': 'flex-start', alignItems: 'center'}}>{m.time}</sup>
                                                    <div>
                                                        {
                                                            <img src = {m.message} alt = '' height = '300' width = '100%' />
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {
                                            m.type === 'post' &&
                                            <div key = {i} style = {{display: 'flex', flexDirection: 'column', justifyTracks: 'center', alignItems: m.sender === user.uName ? 'flex-end': 'flex-start', border: '1px solid black'}}>
                                                <Link to = {`/p/${m.message.pId}`} style = {{border: '1px solid black', width: '50%'}}>
                                                    <sup style = {{fontSize: '0.75em', display: 'flex', justifyContent: m.sender === user.uName ? 'flex-end': 'flex-start', alignItems: 'center'}}>{m.time}</sup>
                                                    <div style = {{maxWidth: '100%'}}>
                                                        <div style = {{display: 'flex', flexDirection: 'column'}}>
                                                            <div style = {{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                                <div>{m.message.uName}</div>
                                                                <div>{`c/${m.message.cName}`}</div>
                                                            </div>
                                                            <div style = {{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
                                                                {
                                                                    m.message.pTitle
                                                                }
                                                            </div>
                                                        </div>
                                                        {
                                                            m.message.pThumbnail &&
                                                            <div>
                                                                {
                                                                    m.message.pThumbnail &&
                                                                    <img src = {m.message.pThumbnail} alt = '' height = '300' width = '100%' />
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                                </Link>
                                            </div>
                                        }
                                        {
                                            m.type === 'community' &&
                                            <div key = {i} style = {{display: 'flex', flexDirection: 'column', justifyTracks: 'center', alignItems: m.sender === user.uName ? 'flex-end': 'flex-start', border: '1px solid black'}}>
                                                <div style = {{border: '1px solid black', maxWidth: '50%', wordWrap: 'break-word'}}>
                                                    <Link to = {`c/${m.message.cName}`} style = {{border: '1px solid black', width: '50%'}}>
                                                        <sup style = {{fontSize: '0.75em', display: 'flex', justifyContent: m.sender === user.uName ? 'flex-end': 'flex-start', alignItems: 'center'}}>{m.time}</sup>
                                                        <div style = {{maxWidth: '100%'}}>
                                                            <div style = {{display: 'flex', justifyContent: 'center', alignItems: m.sender === user.uName ? 'flex-end': 'flex-start', flexDirection: 'column'}}>
                                                            {/* <div>{m.message.uName}</div> */}
                                                                <div>Follow {`c/${m.message.cName}`}</div>
                                                            
                                                            {
                                                                m.message.cThumbnail &&
                                                                <div>
                                                                    <img src = {`/uploads/communityThumbnails/${m.message.cThumbnail}`} alt = '' height = '300' width = '100%' />
                                                                </div>
                                                            }
                                                        </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        }
                                        {
                                            m.type === 'user' &&
                                            <div key = {i} style = {{display: 'flex', flexDirection: 'column', justifyTracks: 'center', alignItems: m.sender === user.uName ? 'flex-end': 'flex-start', border: '1px solid black'}}>
                                                <div style = {{border: '1px solid black', maxWidth: '50%', wordWrap: 'break-word'}}>
                                                    <Link to = {`u/${m.message.uName}`} style = {{border: '1px solid black', width: '50%'}}>
                                                        <sup style = {{fontSize: '0.75em', display: 'flex', justifyContent: m.sender === user.uName ? 'flex-end': 'flex-start', alignItems: 'center'}}>{m.time}</sup>
                                                        <div style = {{maxWidth: '100%'}}>
                                                            <div style = {{display: 'flex', justifyContent: 'center', alignItems: m.sender === user.uName ? 'flex-end': 'flex-start', flexDirection: 'column'}}>
                                                                <div>Follow {`u/${m.message.uName}`}</div>
                                                            
                                                                {
                                                                    m.message.uProfilePicture &&
                                                                    <div>
                                                                        <img src = {`/uploads/profilePictures/${m.message.uProfilePicture}`} alt = '' height = '300' width = '100%' />
                                                                    </div>
                                                                }
                                                        </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        }
                                    </>
                                }
                            }):
                            'Why so empty, say hi'
                        }
                    </div>

                    {
                        socket &&
                        <div style = {{width: '100%', border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'space-between'}}>
                            <div style = {{width: '80%'}}>
                                <input type = 'text' value = {messageText} onChange = {handleMessageTextChange} onKeyDown = {handleEnterKey} style = {{width: '100%', display: 'flex'}} />
                            </div>

                            <div style = {{width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <label htmlFor = 'chat-share-file' style = {{width: '50%', border: '1px solid black'}}>File
                                    <input type = 'file' id = 'chat-share-file' name = 'chat-share-file' style = {{display: 'none'}} onChange = {handleShareFile} accept="image/png, image/jpeg" />
                                </label>
                    
                                <button style = {{width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center'}} onClick = {handleMessageSend}>Send</button>
                            </div>
                        </div>
                    }
                </div>
            }

        </div>:
        <div>
            Please select a user to chat with
        </div>
    );
}

export default ChatFrame;