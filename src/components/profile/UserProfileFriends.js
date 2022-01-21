import { useContext, useEffect, useState } from "react"
import {UserAuthStatusContext} from '../../contexts/UserAuthStatus';

import Follow from '../reusable/Follow';

import axios from 'axios';

const UserProfileFriends = ({uName}) => {
    const [userFriends, setUserFriends] = useState([]);
    const {user} = useContext(UserAuthStatusContext);

    useEffect(() => {
        const controller = new AbortController();

        const getFriends = async () => {
            console.log(uName);
            const {signal} = controller;
            const response = await axios.post('/getFriends', {uName: uName}, {signal: signal});
            console.log(response.data);

            setUserFriends(response.data);
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

    return <div>
            {
                userFriends.length > 0 ?
                userFriends.map(friend => {
                    return <div key = {friend._id} style = {{width: '50%', border: '1px solid grey', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                {friend.username}

                                {
                                    friend.username !== user.uName &&
                                    <Follow followingStatus = {friend.isFriend} setFollowingStatus = {handleSetFollowingStatus} friendsList = {true} type = 'user' target = {friend._id} />
                                }   
                            </div>
                }):
                'No friends'
            }
        </div>
}

export default UserProfileFriends;