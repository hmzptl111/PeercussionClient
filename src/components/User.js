import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import UserProfileNav from './profile/UserProfileNav';
import UserProfileTab from './profile/UserProfileTab';

import Header from "./Header";
import PageBanner from "./reusable/PageBanner";

import axios from 'axios';

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
            if(user.status === 200) {
                if(user.data.error) {
                    setIsAccountPrivateAndNotFriend(true);
                } else {
                    setIsAccountPrivateAndNotFriend(false);
                }
                setUser(user.data);
            }
        }
        
        getUserInfo();
        // eslint-disable-next-line
    }, [uName]);

    return (
        <>
            <Header />
            
            {
                user &&
                <PageBanner uName = {uName} type = 'user' target = {user._id} />
            }

            {
                user && !isAccountPrivateAndNotFriend ?
                <>
                    <UserProfileNav uName = {uName} />
                    <UserProfileTab user = {user} />
                </>:
                'This account is private'
            }
        </>
    );
}

export default User;