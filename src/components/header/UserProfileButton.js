import React, { useContext, useEffect, useRef, useState } from 'react';
import '../../styles/header/UserProfileButton.css';

import {Link} from 'react-router-dom';

import {ReactComponent as UserProfileIcon} from '../../images/user_default_profile.svg';
import { UserAuthStatusContext } from '../../contexts/UserAuthStatus';

import {ReactComponent as UserProfileIconSmall} from '../../images/user_default_profile_small.svg';
import {ReactComponent as EditUserProfileIcon} from '../../images/edit_profile_picture.svg';
import {ReactComponent as CommunityIcon} from '../../images/community.svg';
import {ReactComponent as DraftIcon} from '../../images/draft.svg';
import {ReactComponent as ShareIcon} from '../../images/share.svg';
import {ReactComponent as SignOutIcon} from '../../images/sign_out.svg';

const UserProfileButton = () => {
    const userProfileRef = useRef();
    const [isdropdownOpen, setIsDropdownOpen] = useState(false);

    const {isUserSignedIn, setIsUserSignedIn} = useContext(UserAuthStatusContext);

    useEffect(() => {
        const checkIfClickedOutside = e => {
          if (isdropdownOpen && userProfileRef.current && !userProfileRef.current.contains(e.target)) {
            setIsDropdownOpen(false);
          }
        }
    
        document.addEventListener('mousedown', checkIfClickedOutside);
    
        return () => {
          document.removeEventListener('mousedown', checkIfClickedOutside);
        }
      }, [isdropdownOpen]);

    const handleSignOut = () => {
        setIsUserSignedIn(false);
    }

    return(
        isUserSignedIn &&
        <div className = 'user-profile-dropdown' ref = {userProfileRef}>
            <button className = 'user-profile-dropdown-button' onClick = {() => setIsDropdownOpen(oldState => !oldState)}>
                <UserProfileIcon />
            </button>
            {
                isdropdownOpen &&
                <ul className = 'user-profile-dropdown-list'>
                    <Link to = '/profile' className = 'user-profile-dropdown-list-item'>
                        <li>
                            User Profile
                            <UserProfileIconSmall />
                        </li>
                    </Link>
                    <Link to = '/#' className = 'user-profile-dropdown-list-item'>
                        <li>
                            Edit Profile Picture
                            <EditUserProfileIcon />
                        </li>
                    </Link>
                    <Link to = '/#' className = 'user-profile-dropdown-list-item'>
                        <li>
                            Friends
                            <CommunityIcon />
                        </li>
                    </Link>
                    <Link to = '/#' className = 'user-profile-dropdown-list-item'>
                        <li>
                            Drafts
                            <DraftIcon />
                        </li>
                    </Link>
                    <Link to = '/#' className = 'user-profile-dropdown-list-item'>
                        <li>
                            Share Profile
                            <ShareIcon />
                        </li>
                    </Link>
                    <li className = 'user-profile-dropdown-list-item-sign-out' onClick = {handleSignOut}>
                        Sign out
                        <SignOutIcon />
                    </li>
                </ul>
            }
        </div>
    );
};

export default UserProfileButton;