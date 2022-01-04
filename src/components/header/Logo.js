import React from 'react';
import '../../styles/header/Logo.css';

import { Link } from 'react-router-dom';

import {ReactComponent as LogoIcon} from '../../images/logo.svg';

const Logo = () => {
    return(
        <div className = 'logo'>
            <Link to = '/'>
                <LogoIcon />
            </Link>
        </div>
    );
};

export default Logo;