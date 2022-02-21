import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserProfileCurrentTabContext } from '../../contexts/UserProfileCurrentTab';
import { useHistory } from 'react-router-dom';
import '../../styles/header/UserProfileButton.css';

import ChatShare from '../chat/ChatShare';

import GeneralProfileIcon from '../reusable/GeneralProfileIcon';

import axios from 'axios';

// import {ReactComponent as UserProfileIcon} from '../../images/user_default_profile.svg';
import { UserAuthStatusContext } from '../../contexts/UserAuthStatus';
import {SocketContext} from '../../contexts/Socket';
import {UserRoomsContext} from '../../contexts/UserRooms';


import InitialsIcon from '../reusable/InitialsIcon';

import {ReactComponent as UserProfileIconSmall} from '../../images/user_default_profile_small.svg';
import {ReactComponent as ViewUserProfilePicture} from '../../images/view_profile_picture.svg';
import {ReactComponent as EditUserProfileIcon} from '../../images/edit_profile_picture.svg';

import {ReactComponent as CommunityIcon} from '../../images/community.svg';
// import {ReactComponent as DraftIcon} from '../../images/draft.svg';
import {ReactComponent as ShareIcon} from '../../images/share.svg';
import {ReactComponent as SignOutIcon} from '../../images/sign_out.svg';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../reusable/PopUp';

import {ReactComponent as CloseIcon} from '../../images/close.svg';

import UpdateUserProfilePicturePopup from '../reusable/UpdateUserProfilePicturePopup';

const UserProfileButton = () => {
    const userProfileRef = useRef();
    const [isdropdownOpen, setIsDropdownOpen] = useState(false);

    const {user, setUser, isUserSignedIn, setIsUserSignedIn} = useContext(UserAuthStatusContext);
    const {setSocket} = useContext(SocketContext);
    const {setRooms, setCurrentChat} = useContext(UserRoomsContext);

    const [profilePicture, setProfilePicture] = useState(null);

    let history = useHistory();
    const {setCurrentTab} = useContext(UserProfileCurrentTabContext);

    useEffect(() => {
        if(!isUserSignedIn || !user) return;

        const getUserProfilePicture = async () => {
            const response = await axios.post('/getProfilePicture', {uName: user.uName});
            if(response.data.message && response.data.message !== 'no pp found') {
                setProfilePicture(response.data.message);
            }
        }

        getUserProfilePicture();
        //eslint-disable-next-line
    }, [user, isUserSignedIn]);

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
        
        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        setIsUserSignedIn(false);
        setUser(null);
        setSocket(null);
        setRooms(null);
        setCurrentChat(null);
        
        history.push('/');
    }

    const handleRedirectToUserProfileFriendsTab = () => {
        setCurrentTab('Friends');
        setIsDropdownOpen(false);
        history.push(`/u/${user.uName}`);
    }

    const handleRedirectToEditUserProfilePicture = () => {
        setIsDropdownOpen(false);

        let choice = PopUp('Set Profile Picture', <UpdateUserProfilePicturePopup />);
        PopUpQueue(choice);
        return;
    }

    const handleRedirectToViewUserProfilePicture = () => {
        setIsDropdownOpen(false);
        history.push('/profilePicture/view');
    }

    const handleShare = () => {
        const shareUserProfile = {
            uName: user.uName,
            uProfilePicture: user.uProfilePicture
        }

        let sharePopup = PopUp('Share user profile with', <ChatShare user = {shareUserProfile && shareUserProfile} />);
        PopUpQueue(sharePopup);
    }

    return <>
        {
            user && isUserSignedIn &&
            <div className = 'user-profile-dropdown' ref = {userProfileRef}>
                <div onClick = {() => setIsDropdownOpen(oldState => !oldState)} className = 'user-profile-dropdown-button'>
                    {
                        profilePicture ?
                        <GeneralProfileIcon imageSource = 'profilePictures' imageID = {profilePicture} />:
                        <InitialsIcon initial = {user.uName[0]} />
                    }
                </div>
                {
                    isdropdownOpen &&
                    <div className = 'user-profile-dropdown-list'>
                        <div className='menu-dropdown-close' onClick = {() => setIsDropdownOpen(false)}>
                            <CloseIcon />
                        </div>

                        <div onClick = {handleRedirectToUserProfile} className = 'user-profile-dropdown-list-item'>
                            User Profile
                            <UserProfileIconSmall />
                        </div>
                        <div onClick = {handleRedirectToUserProfileFriendsTab} className = 'user-profile-dropdown-list-item'>
                            Friends
                            <CommunityIcon />
                        </div>
                        <div onClick = {handleRedirectToViewUserProfilePicture} className = 'user-profile-dropdown-list-item'>
                            View Profile Picture
                            <ViewUserProfilePicture />
                        </div>
                        <div onClick = {handleRedirectToEditUserProfilePicture} className = 'user-profile-dropdown-list-item'>
                            Edit Profile Picture
                            <EditUserProfileIcon />
                        </div>
                        {/* <Link to = '/#' className = 'user-profile-dropdown-list-item'>
                            <li>
                                Drafts
                                <DraftIcon />
                            </li>
                        </Link> */}
                        <div className = 'user-profile-dropdown-list-item' onClick = {handleShare}>
                            Share Profile
                            <ShareIcon />
                        </div>
                        <div className = 'user-profile-dropdown-list-item user-profile-dropdown-list-item-sign-out' onClick = {handleSignOut}>
                            Sign out
                            <SignOutIcon />
                        </div>
                    </div>
                }
            </div>
        }

        <Popup />
    </>
};

export default UserProfileButton;