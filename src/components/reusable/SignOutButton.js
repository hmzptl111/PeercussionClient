import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import '../../styles/reusable/SignOutButton.css';
import PillButton from '../reusable/PillButton';

import { whiteColor } from '../../index';

import axios from 'axios';
import { UserAuthStatusContext } from '../../contexts/UserAuthStatus';


const SignOutButton = () => {
    const {setUser, setIsUserSignedIn} = useContext(UserAuthStatusContext);
    let history = useHistory();
    
    const handleSignOut = async (e) => {
        e.preventDefault();
        console.log('sign out clicked');
        const response = await axios.post('/signOut');
        if(response.status === 200) {
            setIsUserSignedIn(false);
            setUser(null);
            console.log(response.data.message);
            history.push('/');
        } else {
            console.log(response.data.error);
        }
    }

    return(
        <div className = 'sign-out-button' onClick = {handleSignOut} >
            <PillButton buttonText = "Sign out" backgroundColor = {whiteColor} />
        </div>
    );
};

export default SignOutButton;
