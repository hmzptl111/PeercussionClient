import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import UserProfileNav from './profile/UserProfileNav';
import UserProfileTab from './profile/UserProfileTab';

import Header from "./Header";
import PageBanner from "./reusable/PageBanner";

import axios from 'axios';

import Popup from 'react-popup';
import { PopUp, PopUpQueue } from "./reusable/PopUp";

const User = () => {
    const {uName} = useParams();
    const [user, setUser] = useState();
    const [isAccountPrivateAndNotFriend, setIsAccountPrivateAndNotFriend] = useState();

    useEffect(() => {
        console.log(user);
    }, [user]);

    useEffect(() => {
        const getUserInfo = async () => {
            const user = await axios.post(`/user/${uName}`);
            
            
            if(user.data.error) {
                let error = user.data.error;
                if(user.data.error.message) {
                    error = user.data.error.message;
                    setIsAccountPrivateAndNotFriend(true);
                    setUser(user.data.error);
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
                <PageBanner uName = {uName} uProfilePicture = {user.profilePicture} type = 'user' target = {user._id} />
            }

            {
                user && !isAccountPrivateAndNotFriend ?
                <>
                    <UserProfileNav uName = {uName} />
                    <UserProfileTab user = {user} />
                </>:
                'This account is private'
            }

            <Popup />
        </>
    );
}

export default User;