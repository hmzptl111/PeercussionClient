import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserProfileCurrentTabContext } from '../../contexts/UserProfileCurrentTab';
import { useHistory } from 'react-router-dom';
import '../../styles/header/UserProfileButton.css';

import {Link} from 'react-router-dom';

import GeneralProfileIcon from '../reusable/GeneralProfileIcon';

import axios from 'axios';

// import {ReactComponent as UserProfileIcon} from '../../images/user_default_profile.svg';
import { UserAuthStatusContext } from '../../contexts/UserAuthStatus';

import InitialsIcon from '../reusable/InitialsIcon';

import {ReactComponent as UserProfileIconSmall} from '../../images/user_default_profile_small.svg';
import {ReactComponent as ViewUserProfilePicture} from '../../images/view_profile_picture.svg';
import {ReactComponent as EditUserProfileIcon} from '../../images/edit_profile_picture.svg';
import {ReactComponent as CommunityIcon} from '../../images/community.svg';
// import {ReactComponent as DraftIcon} from '../../images/draft.svg';
import {ReactComponent as ShareIcon} from '../../images/share.svg';
import {ReactComponent as SignOutIcon} from '../../images/sign_out.svg';


const UserProfileButton = () => {
    const userProfileRef = useRef();
    const [isdropdownOpen, setIsDropdownOpen] = useState(false);

    const {user, isUserSignedIn, setIsUserSignedIn} = useContext(UserAuthStatusContext);

    const [profilePicture, setProfilePicture] = useState();

    let history = useHistory();
    const {setCurrentTab} = useContext(UserProfileCurrentTabContext);

    useEffect(() => {
        const getUserProfilePicture = async () => {
            if(!user) return;
            const response = await axios.post('/getProfilePicture', {uName: user.uName});
            if(response.status === 200) {
                setProfilePicture(response.data.url);
            }
        }

        getUserProfilePicture();
        //eslint-disable-next-line
    }, [user]);

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

    const handleRedirectToUserProfile = () => {
        setCurrentTab('Posts');
        setIsDropdownOpen(false);
        history.push(`/u/${user.uName}`);
    }

    const handleSignOut = async () => {
        console.log('sign out clicked');
        const response = await axios.post('/signOut');
        if(response.status === 200) {
            setIsUserSignedIn(false);
            console.log(response.data.message);
            history.push('/');
        } else {
            console.log(response.data.error);
        }
    }

    const handleRedirectToUserProfileFriendsTab = () => {
        setCurrentTab('Friends');
        setIsDropdownOpen(false);
        history.push(`/u/${user.uName}`);
    }

    const handleRedirectToEditUserProfilePicture = () => {
        setIsDropdownOpen(false);
        history.push('/profilePicture/edit');
    }

    const handleRedirectToViewUserProfilePicture = () => {
        setIsDropdownOpen(false);
        history.push('/profilePicture/view');
    }


    return(
        isUserSignedIn &&
        <div className = 'user-profile-dropdown' ref = {userProfileRef}>
            <div onClick = {() => setIsDropdownOpen(oldState => !oldState)} style = {{cursor: 'pointer'}}>
                {
                    profilePicture ?
                    <GeneralProfileIcon imageSource = 'profilePictures' imageID = {profilePicture} />:
                    <InitialsIcon initial = {user.uName[0]} isUpperCase = {true} />
                }
            </div>
            {
                isdropdownOpen &&
                <ul className = 'user-profile-dropdown-list'>
                    <div onClick = {handleRedirectToUserProfile} className = 'user-profile-dropdown-list-item'>
                        <li>
                            User Profile
                            <UserProfileIconSmall />
                        </li>
                    </div>
                    <div onClick = {handleRedirectToUserProfileFriendsTab} className = 'user-profile-dropdown-list-item'>
                        <li>
                            Friends
                            <CommunityIcon />
                        </li>
                    </div>
                    <div onClick = {handleRedirectToViewUserProfilePicture} className = 'user-profile-dropdown-list-item'>
                        <li>
                            View Profile Picture
                            <ViewUserProfilePicture />
                        </li>
                    </div>
                    <div onClick = {handleRedirectToEditUserProfilePicture} className = 'user-profile-dropdown-list-item'>
                        <li>
                            Edit Profile Picture
                            <EditUserProfileIcon />
                        </li>
                    </div>
                    {/* <Link to = '/#' className = 'user-profile-dropdown-list-item'>
                        <li>
                            Drafts
                            <DraftIcon />
                        </li>
                    </Link> */}
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