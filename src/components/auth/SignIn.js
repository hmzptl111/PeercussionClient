import '../../styles/auth/Auth.css';

import { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { UserAuthStatusContext } from '../../contexts/UserAuthStatus';

import axios from 'axios';

import Logo from '../header/Logo';

import Popup from 'react-popup';
import { PopUp, PopUpQueue } from '../reusable/PopUp';


const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isUserNew, setIsUserNew] = useState(false);
    
    const [genericError, setGenericError] = useState('');
    
    const {setUser, isUserSignedIn, setIsUserSignedIn} = useContext(UserAuthStatusContext);

    let history = useHistory();

    
    useEffect(() => {
        if(isUserSignedIn) {
            history.replace('/');
        }
        
        if(!history.location.state) return;
        if(history.location.state.from === 'SignUp') {
            const messagePopup = PopUp('Important', history.location.state.message);
            PopUpQueue(messagePopup);
            setIsUserNew(true);

            history.replace({...history.location, state: {}});
            return;
        } else if(history.location.state.from === 'ResetPassword') {
            let resetPasswordPopup = PopUp('Update', history.location.state.message);
            PopUpQueue(resetPasswordPopup);

            history.replace({...history.location, state: {}});
            return;
        }
        // eslint-disable-next-line
    }, [isUserSignedIn]);

    const handleUsername = e => {
        setUsername(e.target.value);
    }

    const handlePassword = e => {
        setPassword(e.target.value);
    }

    
    const handleSignIn = async (e) => {
        e.preventDefault();
        
        setGenericError('');
        
        if(username === '' || password === '') {
            setGenericError('Some or all of the required fields are empty');
            return;
        }
        
        const payload = {
            username: username,
            password: password
        }
        
        const result = await axios.post('/signIn', payload);
        if(result.data.message) {
            setUser({
                uId: result.data.uId,
                uName: result.data.uName
            });
            setIsUserSignedIn(true);
            history.replace('/', {from: 'SignIn', isUserNew: isUserNew, message: result.data.message});
        } else {
            const errorPopup = PopUp('Something went wrong', result.data.error);
            PopUpQueue(errorPopup);
        }
    }


    return <div className = 'container'>
    <div className = 'container-auth'>
        <form onSubmit = {handleSignIn} className = 'auth-card'>
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
                <div className = 'auth-footer-left'>
                    <Link to = '/signup' className = 'auth-footer-sign-up'>Sign up</Link>
                    <Link to = '/forgotPassword' className = 'auth-footer-forgot-password'>Forgot password?</Link>
                </div>

                <input type = 'submit' value = 'Sign in' className = 'auth-footer-submit' />
            </div>
        </form>
    </div>

    <Popup />
</div>
};

export default SignIn;