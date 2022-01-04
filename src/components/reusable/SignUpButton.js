import React from 'react';
import '../../styles/reusable/SignUpButton.css';

import PillButton from '../reusable/PillButton';

import {Link} from 'react-router-dom';

const SignUpButton = () => {

    return(
        <Link to = '/signup' className = 'sign-up-button' >
            <PillButton buttonText = "Sign up" />
        </Link>
        );
};

export default SignUpButton;