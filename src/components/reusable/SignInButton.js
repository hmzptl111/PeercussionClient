import React from 'react';
import '../../styles/reusable/SignInButton.css';
import PillButton from '../reusable/PillButton';

import { Link } from 'react-router-dom';

import { whiteColor } from '../../index';

const SignInButton = () => {
    return(
        <Link to = '/signin' className = 'sign-in-button'>
            <PillButton buttonText = "Sign in" backgroundColor = {whiteColor} />
        </Link>
    );
};

export default SignInButton;
