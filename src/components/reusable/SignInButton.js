import '../../styles/auth/AuthButton.css';

import React from 'react';
import { Link } from 'react-router-dom';


const SignInButton = () => {

    return <Link to = '/signin' className = 'auth-button'>
    Sign in
</Link>
};

export default SignInButton;
