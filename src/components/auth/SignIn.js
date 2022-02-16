import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';

import BackButton from '../reusable/BackButton';

import { UserAuthStatusContext } from "../../contexts/UserAuthStatus";

import Popup from 'react-popup';
import 'react-popup/dist/index.css';
import { PopUp, PopUpQueue } from "../reusable/PopUp";

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    //
    const [isUserNew, setIsUserNew] = useState(false);
    //
    const {setUser, setIsUserSignedIn} = useContext(UserAuthStatusContext);
    let history = useHistory();

    const [genericError, setGenericError] = useState('');

    useEffect(() => {
        if(history.location.state && history.location.state.from === 'SignUp') {
            Popup.alert(history.location.state.message);
            const messagePopup = PopUp('Important', history.location.state.message);
            PopUpQueue(messagePopup);
            setIsUserNew(true);
        }
        // eslint-disable-next-line
    }, []);

    const handleUsername = e => {
        setUsername(e.target.value);
    }

    const handlePassword = e => {
        setPassword(e.target.value);
    }

    const payload = {
        username: username,
        password: password
    }    

    const handleSignIn = async (e) => {
        e.preventDefault();

        setGenericError('');
        
        if(username === '' || password === '') {
            console.log('please enter details');
            setGenericError('Some or all the required fields are empty');
            return;
        }
        
        const result = await axios.post('/signIn', payload);
        if(result.data.message) {
            console.log(result.data.message);
            setUser({
                uId: result.data.uId,
                uName: result.data.uName
            });
            setIsUserSignedIn(true);
            history.push('/', {from: 'SignIn', isUserNew: isUserNew, message: result.data.message});
        } else {
            // Popup.alert(result.data.error);
            const errorPopup = PopUp('Something went wrong', result.data.error);
            PopUpQueue(errorPopup);
        }
    }

    return (
        <>
            <BackButton />

            {
                genericError &&
                <h4>{genericError}</h4>
            }

            <form onSubmit = {handleSignIn} style = {{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                <input type = 'text' placeholder = 'username or email' value = {username} onChange = {handleUsername} />
                

                <input type = 'password' placeholder = 'password' value = {password} onChange = {handlePassword} />
                

                <input type = 'submit' value = 'Sign in' />
            </form>

            <Popup />
        </>
    );
};

export default SignIn;