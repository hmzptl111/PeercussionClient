import '../../styles/chat/ChatFrame.css';

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

import {ReactComponent as ImageIcon} from '../../images/gallery.svg';

import {ReactComponent as MenuIcon} from '../../images/menu.svg';

const ChatFrame = ({setIsMenuOpen}) => {
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

        socket.on('message', async (message) => {
            console.log(message);

            let newMessage = message;
            if(newMessage.type === 'image') {
                newMessage.message = `data:image/jpeg;base64,${Buffer.from(newMessage.message).toString('base64')}`
                // newMessage.message = newMessage.message.toString('base64');
            }

            setMessages(previousState => {
                return [...previousState, newMessage];
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

            let previousMessages = [];
            for(let i = 0; i < response.data.message.length; i++) {
                let currentPreviousMessage = response.data.message[i];

                if(currentPreviousMessage.type === 'image') {
                    let base64Image = `data:image/jpeg;base64,${currentPreviousMessage.message.toString('base64')}`;
                    currentPreviousMessage.message = base64Image;
                }

                previousMessages.push(currentPreviousMessage);
            }

            setMessages(previousMessages);
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
            message: messageText
        }

        socket.emit('message', payload, currentChat.room);
        setMessageText('');
    }

    const handleEnterKey = e => {
        if(e.keyCode === 13) handleMessageSend();
    }

    

    const handleShareFile = e => {
        if(!e.target.files[0]) return;
        if(!socket) return;

        const date = new Date();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const image = e.target.files[0];
        console.log(image);

        const payload = {
            type: 'image',
            time: `${hours}:${minutes}`,
            message: image,
            roomID: currentChat.room
        }

        socket.emit('message', payload, currentChat.room);      
    }

    

    return <>
        {
            user && currentChat &&
            <div className = 'chat-frame'>
                {
                    <div className = ''>
                        <div className = 'chat-frame-header'>
                            <div className = 'chat-frame-header-item'>
                                <div className = 'chat-frame-header-item chat-frame-header-menu'>
                                    {
                                        <div onClick = {() => setIsMenuOpen(true)}>
                                            <MenuIcon />
                                        </div>
                                    }
                                </div>
                                
                                {
                                    currentChat &&
                                    (
                                        currentChat.uProfilePicture ?
                                        <GeneralProfileIcon imageSource = 'profilePictures' imageID =       {currentChat.uProfilePicture} />:
                                        <InitialsIcon initial = {currentChat.uName[0]} isUpperCase = {true} />
                                    )
                                }
                                
                                <span className = 'chat-frame-header-text'>{currentChat.uName}</span>

                            </div>
    
                            <div className = 'chat-frame-header-item'>
                                {
                                    currentChat.isUserOnline &&
                                    'Online'
                                }
                            </div>

                        </div>
                        
                        <div className = 'chat-body'>
                        <div className = 'messages'>
                            {
                                messages ?
                                messages.map((m, i) => {
                                    return <div key = {m.id} className = 'message' ref = {messages.length === i + 1 ? lastMessageRef: null}>
                                    {
                                        m.type === 'text' &&
                                        <div className = {m.sender === user.uName ? 'sent': 'received'}>
                                                <sup className = {m.sender === user.uName ? 'message-time sent': 'message-time received'}>{m.time}</sup>
                                                <div className = 'message-body'>{m.message}</div>
                                        </div>
                                    }
                                    {
                                        m.type === 'image' &&
                                        <div className = {m.sender === user.uName ? 'sent': 'received'}>
                                                <sup className = {m.sender === user.uName ? 'message-time sent': 'message-time received'}>{m.time}</sup>
                                                <div className = 'message-body'>
                                                    <img src = {m.message} alt = '' className = ' message-body-image' />
                                                </div>
                                        </div>
                                    }
                                    {
                                        m.type === 'post' &&
                                        <div className = {m.sender === user.uName ? 'sent': 'received'}>
                                            <sup className = {m.sender === user.uName ? 'message-time sent': 'message-time received'}>{m.time}</sup>
                                            <Link to = {`/p/${m.message.pId}`} className = 'message-body message-body-link'>
                                                <div className = 'message-body-item'>
                                                    <div className = 'message-body-item-header'>
                                                        <div>{m.message.uName}</div>
                                                        <div>{`c/${m.message.cName}`}</div>
                                                    </div>
                                                    <div className = 'message-body-item-title'>
                                                        <h4>{m.message.pTitle}</h4>
                                                    </div>
                                                    {
                                                        m.message.pThumbnail &&
                                                        <div className = 'message-body-item-thumbnail'>
                                                            {
                                                                m.message.pThumbnail &&
                                                                <img src = {m.message.pThumbnail} alt = '' className = 'message-body-image' />
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                            </Link>
                                        </div>
                                    }
                                    {
                                        m.type === 'community' &&
                                        <div className = {m.sender === user.uName ? 'sent': 'received'}>
                                            <sup className = {m.sender === user.uName ? 'message-time sent': 'message-time received'}>{m.time}</sup>
                                            <Link to = {`c/${m.message.cName}`} className = 'message-body message-body-link'>
                                                <div className = 'message-body-item'>
                                                    <div className = 'message-body-item-header sent'>
                                                        <div>Check this community out:
                                                            <div className = 'message-body-header-ref'>{`c/${m.message.cName}`}</div>
                                                        </div>
                                                    </div>
                                                    {
                                                        m.message.cThumbnail &&
                                                        <div className = 'message-body-item-thumbnail'>
                                                            <img src = {`/uploads/communityThumbnails/${m.message.cThumbnail}`} alt = '' className = 'message-body-image' />
                                                        </div>
                                                    }
                                                </div>
                                            </Link>
                                        </div>
                                    }
                                    {
                                        m.type === 'user' &&
                                        <div className = {m.sender === user.uName ? 'sent': 'received'}>
                                            <sup className = {m.sender === user.uName ? 'message-time sent': 'message-time received'}>{m.time}</sup>
                                            <Link to = {`u/${m.message.uName}`} className = 'message-body message-body-link'>
                                                <div className = 'message-body-item'>
                                                    <div className = 'message-body-item-header sent'>
                                                        <div> Check this user out:
                                                            <div className = 'message-body-header-ref'>
                                                                {`u/${m.message.uName}`}
                                                            </div>
                                                        </div>
                                                    
                                                    </div>
                                                        {
                                                            m.message.uProfilePicture &&
                                                            <div className = 'message-body-item-thumbnail'>
                                                                <img src = {`/uploads/profilePictures/${m.message.uProfilePicture}`} alt = '' className = 'message-body-image' />
                                                            </div>
                                                        }
                                                </div>
                                            </Link>
                                        </div>
                                    }
                                </div> 
                                }):
                                'No message'
                            }
                        </div>
    
                        {
                            socket &&
                            <div className = 'chat-body-footer'>
                                <input type = 'text' value = {messageText} onChange = {handleMessageTextChange} onKeyDown = {handleEnterKey} placeholder = 'Message' className = 'chat-body-footer-input-text' />
    
                                <label htmlFor = 'chat-share-file' className = 'chat-body-footer-share-file-container'>
                                    <ImageIcon />
                                    <input type = 'file' id = 'chat-share-file' name = 'chat-share-file' style = {{display: 'none'}} onChange = {handleShareFile} accept="image/png, image/jpeg" />
                                </label>
                    
                                <button onClick = {handleMessageSend} className = 'chat-body-footer-send'>Send</button>
                            </div>
                        }
                        </div>
                    </div>
                }
    
            </div>
        }

        <Popup />
    </>
}

export default ChatFrame;





















// import '../../styles/chat/ChatFrame.css';

// import { useContext, useEffect, useRef, useState } from "react"

// import { UserRoomsContext } from "../../contexts/UserRooms";
// import { UserAuthStatusContext } from "../../contexts/UserAuthStatus";
// import { SocketContext } from "../../contexts/Socket";

// import GeneralProfileIcon from "../reusable/GeneralProfileIcon";
// import InitialsIcon from "../reusable/InitialsIcon";

// import axios from 'axios';

// import {Link} from 'react-router-dom';

// import Popup from 'react-popup';
// import {PopUp, PopUpQueue} from '../reusable/PopUp';

// import {ReactComponent as ImageIcon} from '../../images/gallery.svg';

// import {ReactComponent as MenuIcon} from '../../images/menu.svg';

// const ChatFrame = ({setIsMenuOpen}) => {
//     const {currentChat} = useContext(UserRoomsContext);
//     const [messageText, setMessageText] = useState('');
//     const [messages, setMessages] = useState([]);
//     const {socket} = useContext(SocketContext);
//     const {user} = useContext(UserAuthStatusContext);

//     const lastMessageRef = useRef();


//     useEffect(() => {
//         console.log(messages);
//         if(!lastMessageRef.current) return;
        
//         lastMessageRef.current.scrollIntoView();
//     }, [messages]);

//     useEffect(() => {
//         if(!user || !socket) return;
//         console.log(user);
//         console.log(socket);

//         socket.on('message', async (message) => {
//             console.log(message);

//             let newMessage = message;
//             if(newMessage.type === 'image') {
//                 newMessage.message = `data:image/jpeg;base64,${Buffer.from(newMessage.message).toString('base64')}`
//                 // newMessage.message = newMessage.message.toString('base64');
//             }

//             setMessages(previousState => {
//                 return [...previousState, newMessage];
//             });
//         });
//     }, [user, socket]);

//     useEffect(() => {
//         if(!socket || !currentChat) return;

//         console.log(currentChat);
//         const getChats = async () => {
//             const response = await axios.post('/getChats', {roomID: currentChat.room});
//             if(response.data.error) {
//                 let errorPopup = PopUp('Something went wrong', response.data.error);
//                 PopUpQueue(errorPopup);
//                 return;
//             }

//             let previousMessages = [];
//             for(let i = 0; i < response.data.message.length; i++) {
//                 let currentPreviousMessage = response.data.message[i];

//                 if(currentPreviousMessage.type === 'image') {
//                     let base64Image = `data:image/jpeg;base64,${currentPreviousMessage.message.toString('base64')}`;
//                     currentPreviousMessage.message = base64Image;
//                 }

//                 previousMessages.push(currentPreviousMessage);
//             }

//             setMessages(previousMessages);
//         }

//         getChats();
//         //eslint-disable-next-line
//     }, [socket, currentChat]);

//     const handleMessageTextChange = e => {
//         setMessageText(e.target.value);
//     }

//     const handleMessageSend = () => {
//         if(messageText === '') return;

//         const date = new Date();
//         const hours = date.getHours().toString().padStart(2, '0');
//         const minutes = date.getMinutes().toString().padStart(2, '0');
        
//         const payload = {
//             type: 'text',
//             time: `${hours}:${minutes}`,
//             message: messageText
//         }

//         socket.emit('message', payload, currentChat.room);
//         setMessageText('');
//     }

//     const handleEnterKey = e => {
//         if(e.keyCode === 13) handleMessageSend();
//     }

    

//     const handleShareFile = e => {
//         if(!e.target.files[0]) return;
//         if(!socket) return;

//         const date = new Date();
//         const hours = date.getHours().toString().padStart(2, '0');
//         const minutes = date.getMinutes().toString().padStart(2, '0');

//         const image = e.target.files[0];
//         console.log(image);

//         const payload = {
//             type: 'image',
//             time: `${hours}:${minutes}`,
//             message: image,
//             roomID: currentChat.room
//         }

//         socket.emit('message', payload, currentChat.room);      
//     }

    

//     return <>
//         {
//             user && currentChat &&
//             <div className = 'chat-frame'>
//                 {
//                     <div className = ''>
//                         <div className = 'chat-frame-header'>
//                             <div className = 'chat-frame-header-item'>
//                                 <div className = 'chat-frame-header-item chat-frame-header-menu'>
//                                     {
//                                         <div onClick = {() => setIsMenuOpen(true)}>
//                                             <MenuIcon />
//                                         </div>
//                                     }
//                                 </div>
                                
//                                 {
//                                     currentChat &&
//                                     (
//                                         currentChat.uProfilePicture ?
//                                         <GeneralProfileIcon imageSource = 'profilePictures' imageID =       {currentChat.uProfilePicture} />:
//                                         <InitialsIcon initial = {currentChat.uName[0]} isUpperCase = {true} />
//                                     )
//                                 }
                                
//                                 <span className = 'chat-frame-header-text'>{currentChat.uName}</span>

//                             </div>
    
//                             <div className = 'chat-frame-header-item'>
//                                 {
//                                     currentChat.isUserOnline &&
//                                     'Online'
//                                 }
//                             </div>

//                         </div>
                        
//                         <div className = 'chat-body'>
//                         <div className = 'messages'>
//                             {
//                                 messages ?
//                                 messages.map((m, i) => {
//                                     return <div key = {i} className = 'message' ref = {messages.length === i + 1 ? lastMessageRef: null}>
//                                     {
//                                         m.type === 'text' &&
//                                         <div className = {m.sender === user.uName ? 'sent': 'received'}>
//                                                 <sup className = {m.sender === user.uName ? 'message-time sent': 'message-time received'}>{m.time}</sup>
//                                                 <div className = 'message-body'>{m.message}</div>
//                                         </div>
//                                     }
//                                     {
//                                         m.type === 'image' &&
//                                         <div className = {m.sender === user.uName ? 'sent': 'received'}>
//                                                 <sup className = {m.sender === user.uName ? 'message-time sent': 'message-time received'}>{m.time}</sup>
//                                                 <div className = 'message-body'>
//                                                     <img src = {m.message} alt = '' className = ' message-body-image' />
//                                                 </div>
//                                         </div>
//                                     }
//                                     {
//                                         m.type === 'post' &&
//                                         <div className = {m.sender === user.uName ? 'sent': 'received'}>
//                                             <sup className = {m.sender === user.uName ? 'message-time sent': 'message-time received'}>{m.time}</sup>
//                                             <Link to = {`/p/${m.message.pId}`} className = 'message-body message-body-link'>
//                                                 <div className = 'message-body-item'>
//                                                     <div className = 'message-body-item-header'>
//                                                         <div>{m.message.uName}</div>
//                                                         <div>{`c/${m.message.cName}`}</div>
//                                                     </div>
//                                                     <div className = 'message-body-item-title'>
//                                                         <h4>{m.message.pTitle}</h4>
//                                                     </div>
//                                                     {
//                                                         m.message.pThumbnail &&
//                                                         <div className = 'message-body-item-thumbnail'>
//                                                             {
//                                                                 m.message.pThumbnail &&
//                                                                 <img src = {m.message.pThumbnail} alt = '' className = 'message-body-image' />
//                                                             }
//                                                         </div>
//                                                     }
//                                                 </div>
//                                             </Link>
//                                         </div>
//                                     }
//                                     {
//                                         m.type === 'community' &&
//                                         <div className = {m.sender === user.uName ? 'sent': 'received'}>
//                                             <sup className = {m.sender === user.uName ? 'message-time sent': 'message-time received'}>{m.time}</sup>
//                                             <Link to = {`c/${m.message.cName}`} className = 'message-body message-body-link'>
//                                                 <div className = 'message-body-item'>
//                                                     <div className = 'message-body-item-header sent'>
//                                                         <div>Check this community out:
//                                                             <div className = 'message-body-header-ref'>{`c/${m.message.cName}`}</div>
//                                                         </div>
//                                                     </div>
//                                                     {
//                                                         m.message.cThumbnail &&
//                                                         <div className = 'message-body-item-thumbnail'>
//                                                             <img src = {`/uploads/communityThumbnails/${m.message.cThumbnail}`} alt = '' className = 'message-body-image' />
//                                                         </div>
//                                                     }
//                                                 </div>
//                                             </Link>
//                                         </div>
//                                     }
//                                     {
//                                         m.type === 'user' &&
//                                         <div className = {m.sender === user.uName ? 'sent': 'received'}>
//                                             <sup className = {m.sender === user.uName ? 'message-time sent': 'message-time received'}>{m.time}</sup>
//                                             <Link to = {`u/${m.message.uName}`} className = 'message-body message-body-link'>
//                                                 <div className = 'message-body-item'>
//                                                     <div className = 'message-body-item-header sent'>
//                                                         <div> Check this user out:
//                                                             <div className = 'message-body-header-ref'>
//                                                                 {`u/${m.message.uName}`}
//                                                             </div>
//                                                         </div>
                                                    
//                                                     </div>
//                                                         {
//                                                             m.message.uProfilePicture &&
//                                                             <div className = 'message-body-item-thumbnail'>
//                                                                 <img src = {`/uploads/profilePictures/${m.message.uProfilePicture}`} alt = '' className = 'message-body-image' />
//                                                             </div>
//                                                         }
//                                                 </div>
//                                             </Link>
//                                         </div>
//                                     }
//                                 </div> 
//                                 }):
//                                 'No message'
//                             }
//                         </div>
    
//                         {
//                             socket &&
//                             <div className = 'chat-body-footer'>
//                                 <input type = 'text' value = {messageText} onChange = {handleMessageTextChange} onKeyDown = {handleEnterKey} placeholder = 'Message' className = 'chat-body-footer-input-text' />
    
//                                 <label htmlFor = 'chat-share-file' className = 'chat-body-footer-share-file-container'>
//                                     <ImageIcon />
//                                     <input type = 'file' id = 'chat-share-file' name = 'chat-share-file' style = {{display: 'none'}} onChange = {handleShareFile} accept="image/png, image/jpeg" />
//                                 </label>
                    
//                                 <button onClick = {handleMessageSend} className = 'chat-body-footer-send'>Send</button>
//                             </div>
//                         }
//                         </div>
//                     </div>
//                 }
    
//             </div>
//         }

//         <Popup />
//     </>
// }

// export default ChatFrame;