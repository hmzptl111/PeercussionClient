import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';

import { UserAuthStatusContext } from "../../contexts/UserAuthStatus";

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    //
    const [isUserNew, setIsUserNew] = useState(false);
    //
    const {setIsUserSignedIn} = useContext(UserAuthStatusContext);
    let history = useHistory();

    useEffect(() => {
        if(history.location.state && history.location.state.from === 'SignUp') {
            console.log(history.location.pathname);
            console.log('Please sign in');
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
        
        if(username === '' || password === '') {
            console.log('please enter details');
            return;
        }
        
        const result = await axios.post('/signIn', payload);
        if(result.status === 200) {
            //if user's already signed in, sign out from that account
            //...
            //sign in with the new account
            console.log(result.data.message);
            setIsUserSignedIn(true);
            history.push('/', {from: 'SignIn', isUserNew: isUserNew});
        }
    }

    return (
        <form onSubmit = {handleSignIn}>
            <input type = 'text' placeholder = 'username' value = {username} onChange = {handleUsername} />
            <input type = 'password' placeholder = 'password' value = {password} onChange = {handlePassword} />

            <input type = 'submit' value = 'Sign in' />
        </form>
    );
};

export default SignIn;