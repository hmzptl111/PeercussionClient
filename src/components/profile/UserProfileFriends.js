import { useContext, useEffect, useState } from "react"
import {UserAuthStatusContext} from '../../contexts/UserAuthStatus';

import {Link} from 'react-router-dom';

import Follow from '../reusable/Follow';

import axios from 'axios';

import GeneralProfileIcon from "../reusable/GeneralProfileIcon";
import InitialsIcon from "../reusable/InitialsIcon";

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../reusable/PopUp';

const UserProfileFriends = ({uName}) => {
    const [userFriends, setUserFriends] = useState([]);
    const {user} = useContext(UserAuthStatusContext);

    useEffect(() => {
        const controller = new AbortController();

        const getFriends = async () => {
            console.log(uName);
            const {signal} = controller;
            const response = await axios.post('/getFriends', {uName: uName}, {signal: signal});
            
            if(response.data.error) {
                let errorPopup = PopUp('Something went wrong', response.data.error);
                PopUpQueue(errorPopup);
                return;
            }

            console.log(response.data.message);
            setUserFriends(response.data.message);
        }

        getFriends();

        return () => controller.abort();
    }, [uName]);

    const handleSetFollowingStatus = (newFollowingStatus, uId) => {
        setUserFriends(previousState => {
            let newState = [...previousState];
            for(let i = 0; i < newState.length; i++) {
                if(newState[i]._id === uId) {
                    newState[i].isFriend = newFollowingStatus;
                    break;
                }
            }
            return newState;
        });
    }

    return <>
        <div>
            {
                userFriends.length > 0 ?
                userFriends.map(friend => {
                    return <div className = 'list-container'>
                                <div key = {friend._id} className = 'list'>
                                        <Link to = {`/u/${friend.username}`} className = 'list-info'>
                                            {
                                                friend.profilePicture ?
                                                <GeneralProfileIcon imageSource = 'profilePictures' imageID = {user.profilePicture} />:
                                                <InitialsIcon initial = {friend.username[0]} />
                                            }
                                            <span className = 'list-info-text'>{friend.username}</span>
                                        </Link>

                                        {
                                            (friend.username !== (user && user.uName)) &&
                                            <Follow followingStatus = {friend.isFriend} setFollowingStatus = {handleSetFollowingStatus} friendsList = {true} type = 'user' target = {friend._id} />
                                        }
                                    </div>
                    </div>
                }):
                'No friends'
            }
        </div>

        <Popup />
    </>
}

export default UserProfileFriends;