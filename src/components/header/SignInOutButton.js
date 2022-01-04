import React, { useContext } from 'react';
import { UserAuthStatusContext } from '../../contexts/UserAuthStatus';

import SignInButton from '../reusable/SignInButton';
import SignOutButton from '../reusable/SignOutButton';

const SignInOutButton = () => {
    const {isUserSignedIn} = useContext(UserAuthStatusContext);

    // const handleSignInOut = () => {
    //     setIsUserSignedIn(!isUserSignedIn);
    // }

    return(
        isUserSignedIn ?
        <SignOutButton />:
        <SignInButton />
    );
};

export default SignInOutButton;