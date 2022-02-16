import { useEffect, useState } from "react";

import axios from 'axios';

import Popup from 'react-popup';
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

    return <>
        {
            pendingFriendRequests.length > 0 ?
            pendingFriendRequests.map(user => {
                return <div key = {user._id} style = {{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span>{user.username}</span>
                            <button onClick = {() => handleAcceptFriendRequest(user._id)}>Accept Request</button>
                    </div>
            }):
            'No pending friend requests'
        }

        <Popup />
    </>
}

export default UserProfilePendingRequests;