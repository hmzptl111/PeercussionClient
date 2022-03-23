import { useContext } from 'react';

import { UserProfileCurrentTabContext } from '../../contexts/UserProfileCurrentTab';

import UserProfilePosts from './UserProfilePosts';
import UserProfileFriends from './UserProfileFriends';
import GetCommunities from '../reusable/GetCommunities';
import UserProfilePendingRequests from './UserProfilePendingRequests';
import UserProfileUpvotedPosts from './UserProfileUpvotedPosts';
import UserProfileComments from './UserProfileComments';
import UserProfileAbout from './UserProfileAbout';


const UserProfileTab = ({user, setUser}) => {
    const {currentTab} = useContext(UserProfileCurrentTabContext);

    return <>
    {
        currentTab === 'Posts' &&
        <UserProfilePosts uName = {user.username} />
    }
    {
        currentTab === 'Friends' &&
        <UserProfileFriends uName = {user.username} />
    }
    {
        currentTab === 'Upvoted Posts' &&
        <UserProfileUpvotedPosts uName = {user.username} />
    }
    {
        currentTab === 'Comments' &&
        <UserProfileComments uName = {user.username} />
    }
    {
        currentTab === 'Pending Requests' &&
        <UserProfilePendingRequests />
    }
    {
        currentTab === 'Moderates Communities' &&
        <GetCommunities uName = {user.username} type = 'moderates' />
    }
    {
        currentTab === 'Following Communities' &&
        <GetCommunities uName = {user.username} type = 'following' />
    }
    {
        currentTab === 'About' && 
        <UserProfileAbout about = {user.about} targetUser = {user} setUser = {setUser} />
    }
</>
}

export default UserProfileTab;