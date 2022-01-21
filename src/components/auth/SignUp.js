import {useState} from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";

import BackButton from '../reusable/BackButton';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    let history = useHistory();

    const handleUsername = e => {
        setUsername(e.target.value);
    }
    
    const handlePassword = e => {
        setPassword(e.target.value);
    }
    
    const handleConfirmPassword = e => {
        setConfirmPassword(e.target.value);
    }
    
    const handleEmail = e => {
        setEmail(e.target.value);
    }
    
    const handleSignUp = async (e) => {
        e.preventDefault();

        if(username === '' || password === '' || confirmPassword === '' || email === '') {
            console.log('please enter details');
            return;
        }

        //if there's any non-word character(anything except [a-zA-Z0-9_]), username is invalid
        //if username starts with a digit like 3hamza, it is invalid
        const usernameRegex = /^[^\d][\w]+$/;
        if(!usernameRegex.test(username)) {
            console.log('username must only consist of, lowercase characters; uppercase characters; digits; underscores and must not start with a digit');
            return;
        }
        
        // const passwordRegex = /(?=.*[a-z])/;
        // if(!passwordRegex.test(password)) {
        //    console.log('password must contain at least one lowercase character, one uppercase character and one digit');
        //     return;
        // }

        if(password !== confirmPassword) {
            console.log('passwords do not match');
            return;
        }

        //to actually validate user email, send a mail to the user entered mail
        const emailRegex = /\S+@\S+\.\S+/;
        if(!emailRegex.test(email)) {
            console.log('invalid email');
            return;
        }

        const payload = {
            username: username,
            password: password,
            email: email
        }
        const result = await axios.post('/signUp', payload);
        
        if(result.data.error) {
            console.log(result.data.error);
            return;
        }
        console.log(result.data);

        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
        
        console.log('signed in successfully');

        //redirect to home page

        // if(result.status === 200) {
        //     history.push("/", {from: 'SignUp'});
        // }

        if(result.status === 200) {
            history.push("/signin", {from: 'SignUp'});
        }
    }

    return (
        <>
            <BackButton />
            
            <form onSubmit = {handleSignUp}>
                <input type = 'text' placeholder = 'username' value = {username} onChange = {handleUsername} />
                <input type = 'password' placeholder = 'password' value = {password} onChange = {handlePassword} />
                <input type = 'password' placeholder = 'confirm password' value = {confirmPassword} onChange = {handleConfirmPassword} />
                <input type = 'text' placeholder = 'email' value = {email} onChange = {handleEmail} />


                <input type = 'submit' value = 'Sign up' />
            </form>
        </>
    );
}

export default SignUp;