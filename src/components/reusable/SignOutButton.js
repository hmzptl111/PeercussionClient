import { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import '../../styles/auth/AuthButton.css';

import axios from 'axios';

import { UserAuthStatusContext } from '../../contexts/UserAuthStatus';
import {SocketContext} from '../../contexts/Socket';
import {UserRoomsContext} from '../../contexts/UserRooms';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../reusable/PopUp';

const SignOutButton = () => {
    const {setUser, setIsUserSignedIn} = useContext(UserAuthStatusContext);
    const {setSocket} = useContext(SocketContext);
    const {setRooms, setCurrentChat} = useContext(UserRoomsContext);

    let history = useHistory();

    const handleSignOut = async (e) => {
        e.preventDefault();
        
        const response = await axios.post('/signOut');
        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        setIsUserSignedIn(false);
        setUser(null);
        setSocket(null);
        setRooms(null);
        setCurrentChat(null);

        history.push('/');
    }

    return <>
        <div className = 'auth-button' onClick = {handleSignOut} >
            Sign out
        </div>

        <Popup />
    </>
};

export default SignOutButton;
