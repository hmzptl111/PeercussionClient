import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';

import UserProfileNav from './profile/UserProfileNav';
import UserProfileTab from './profile/UserProfileTab';
import Header from './Header';
import PageBanner from './reusable/PageBanner';

import {ReactComponent as PrivateIcon} from '../images/private.svg';

import { PopUp, PopUpQueue } from './reusable/PopUp';


const User = () => {
    const {uName} = useParams();

    const [user, setUser] = useState();
    const [isAccountPrivateAndNotFriend, setIsAccountPrivateAndNotFriend] = useState();
    const [followingStatus, setFollowingStatus] = useState();
    const [isOwner, setIsOwner] = useState();

    useEffect(() => {
        if(!user) return;
        const getFollowStatus = async () => {
            const payload = {
                type: 'user',
                target: user._id
            }

            const response = await axios.post('/followStatus', payload);

            if(response.data.error) {
                let errorPopup = PopUp('Something went wrong', response.data.error);
                PopUpQueue(errorPopup);
                return;
            }

            setIsOwner(response.data.message.isOwner);
            setFollowingStatus(response.data.message.isFollowing);
        }

        getFollowStatus();
        // eslint-disable-next-line
    }, [user, isOwner, followingStatus]);

    useEffect(() => {
        const getUserInfo = async () => {
            const user = await axios.post(`/user/${uName}`);
            
            if(user.data.error) {
                let error = user.data.error;
                if(error.message) {
                    error = error.message;
                    setIsAccountPrivateAndNotFriend(true);
                    setUser(user.data.error);
                    return;
                }
                let errorPopup = PopUp('Something went wrong', error);
                PopUpQueue(errorPopup);
                return;
            }
            setIsAccountPrivateAndNotFriend(false);

            setUser(user.data.message);
        }
        
        getUserInfo();
        // eslint-disable-next-line
    }, [uName]);

    return (
        <>
            <Header />
            
            {
                user &&
                <PageBanner uName = {uName} uProfilePicture = {user.profilePicture} type = 'user' target = {user._id} isOwner = {isOwner} followingStatus = {followingStatus} setFollowingStatus = {setFollowingStatus} />
            }

            {
                user && !isAccountPrivateAndNotFriend ?
                <>
                    <UserProfileNav uName = {uName} />
                    <UserProfileTab user = {user} setUser = {setUser} />
                </>:
                <div className = 'restriction-message'>
                    <PrivateIcon />
                    This account is private
                </div>
            }
        </>
    );
}

export default User;