import {useEffect, useState} from 'react';

import axios from "axios";

const Follow = ({followingStatus, setFollowingStatus, type, target}) => {
    const [buttonText, setButtonText] = useState();

    useEffect(() => {
        if(type === 'community') {
            if(followingStatus === 'no') {
                setButtonText('Follow');
            } else if(followingStatus === 'yes') {
                setButtonText('Unfollow');
            }
        } else if(type === 'user') {
            if(followingStatus === 'no') {
                setButtonText('Add Friend');
            } else if(followingStatus === 'yes') {
                setButtonText('Unfriend');
            } else if(followingStatus === 'pending') {
                setButtonText('Cancel Request');
            }
        }
    }, [type, followingStatus, target]);

    const handleFollow = async (e) => {
        e.preventDefault();

        let payload = {
            type: type,
            target: target
        };

        if(followingStatus === 'no') {
            const response = await axios.post('/follow', payload);
            console.log(response.data);
            if(response.status === 200) {
                if(type === 'community') {
                    setFollowingStatus('yes');
                    setButtonText('Unfollow');
                } else if(type === 'user') {
                    setFollowingStatus('pending');
                    setButtonText('Cancel Request');
                }
            }
        } else if(followingStatus === 'yes') {
            const response = await axios.post('/unfollow', payload);
            console.log(response.data);
            if(response.status === 200) {
                if(type === 'community') {
                    setFollowingStatus('no');
                    setButtonText('Follow');
                } else if(type === 'user') {
                    setFollowingStatus('no');
                    setButtonText('Add Friend');
                }
            }
        } else if(followingStatus === 'pending') {
            payload.cancelFriendRequest = true;
            const response = await axios.post('/unfollow', payload);
            console.log(response.data);
            if(response.status === 200) {
                if(response.data.message === 'User has accepted your friend request') {
                    setFollowingStatus('yes');
                    setButtonText('Unfriend');
                } else {
                    setFollowingStatus('no');
                    setButtonText('Add Friend');
                }
            }
        }

    }

    return <button onClick = {handleFollow}>{buttonText}</button>;
}

export default Follow;

















// import axios from "axios";

// const Follow = ({followingStatus, setFollowingStatus, friendsList = false, type, target}) => {
//     const handleFollow = async (e) => {
//         e.preventDefault();

//         const payload = {
//             type: type,
//             target: target
//         };

//         if(!followingStatus) {
//             const response = await axios.post('/follow', payload);
//             console.log(response.data);
//             if(response.status === 200) {
//                 if(!friendsList) {
//                     setFollowingStatus(true);
//                 } else {
//                     setFollowingStatus(true, target);
//                 }
//             }
//         } else {
//             const response = await axios.post('/unfollow', payload);
//             console.log(response.data);
//             if(response.status === 200) {
//                 if(!friendsList) {
//                     setFollowingStatus(false);
//                 } else {
//                     setFollowingStatus(false, target);
//                 }
//             }
//         }

//     }

//     return <button onClick = {handleFollow}>
//             {
//                 followingStatus ?
//                 'Unfollow':
//                 'Follow'
//             }
//         </button>; 
// }

// export default Follow;