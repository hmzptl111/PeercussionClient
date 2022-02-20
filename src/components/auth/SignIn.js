import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import axios from 'axios';

import BackButton from '../reusable/BackButton';

import { UserAuthStatusContext } from "../../contexts/UserAuthStatus";

import Popup from 'react-popup';
import 'react-popup/dist/index.css';
import { PopUp, PopUpQueue } from "../reusable/PopUp";

import Logo from '../header/Logo';

import '../../styles/auth/Auth.css';

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

    return <div className = 'container'>

                <div className = 'container-auth'>

                    <form onSubmit = {handleSignIn} className = 'auth-card'>
                        <BackButton />

                        <div className = 'auth-card-header'>
                            <div className = 'auth-card-header-logo'>
                                <Logo />
                            </div>
                            <div className = 'auth-card-header-text'>
                                Sign in to your account
                            </div>
                        </div>

                        {
                            genericError &&
                            <h5 className = 'generic-error'>{genericError}</h5>
                        }
                        
                        <div className = 'auth-card-item'>
                            <input type = 'text' placeholder = 'Username or Email' value = {username} onChange = {handleUsername} className = 'auth-card-item-input' />
                        </div>
                            
                            
                        <div className = 'auth-card-item'>
                            <input type = 'password' placeholder = 'Password' value = {password} onChange = {handlePassword} className = 'auth-card-item-input' />
                        </div>
                    

                        <div className = 'auth-footer'>
                            <Link to = '/signup' className = 'auth-footer-sign-in'>Sign up</Link>

                            <input type = 'submit' value = 'Sign in' className = 'auth-footer-submit' />
                        </div>
                    </form>
                </div>

                


                <Popup />
            </div>
};

export default SignIn;