import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

import GeneralProfileIcon from '../reusable/GeneralProfileIcon';
import InitialsIcon from "../reusable/InitialsIcon";
import Empty from "../reusable/Empty";

import {ReactComponent as TickIcon} from '../../images/tick.svg';

import {PopUp, PopUpQueue} from '../reusable/PopUp';


const UserProfilePendingRequests = () => {
    const [pendingFriendRequests, setPendingFriendRequests] = useState([]);

    useEffect(() => {
        const getPendingFriendRequests = async () => {
            const users = await axios.post('/pendingFriendRequests');

            if(users.data.error) {
                let errorPopup = PopUp('Something went wrong', users.data.error);
                PopUpQueue(errorPopup);
                return;
            }

            setPendingFriendRequests(users.data.message);
        }

        getPendingFriendRequests();
        //eslint-disable-next-line
    }, []);

    const handleAcceptFriendRequest = async (uId) => {
        const response = await axios.post('/acceptFriendRequest', {target: uId});
        
        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        setPendingFriendRequests(previousState => {
            let oldState = [...previousState];
            let updatedState = oldState.filter(user => {
                return user._id !== uId;
            });
            return updatedState;
        });
    }

    return pendingFriendRequests.length > 0 ?
<div className = 'list-container'>
    {
        pendingFriendRequests.map(user => {
            return <div key = {user._id} className = 'list'>
                        <Link to = {`/u/${user.username}`} className = 'list-info'>
                            {
                                user.profilePicture ?
                                <GeneralProfileIcon imageSource = 'profilePictures' imageID = {user.profilePicture} />:
                                <InitialsIcon initial = {user.username[0]} />
                            }
                            <span className = 'list-info-text'>{user.username}</span>
                        </Link>

                        <div onClick = {() => handleAcceptFriendRequest(user._id)} className = 'list-button'>
                            Accept Request
                            <TickIcon />
                        </div>
                </div>
        })
    }
</div>:
<Empty text = 'Nothing here, come back later' caption = 'No pending requests to accept' GIF = 'https://c.tenor.com/bGgv8ew9uNAAAAAC/mr-bean.gif' />
}

export default UserProfilePendingRequests;