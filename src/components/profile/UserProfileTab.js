import { useContext } from "react";

import { UserProfileCurrentTabContext } from "../../contexts/UserProfileCurrentTab";

import UserProfilePosts from "./UserProfilePosts";
import UserProfileFriends from "./UserProfileFriends";
import GetCommunities from '../reusable/GetCommunities';
import UserProfilePendingRequests from "./UserProfilePendingRequests";
import UserProfileUpvotedPosts from './UserProfileUpvotedPosts';
// import UserProfileDownvotedPosts from './UserProfileDownvotedPosts';
import UserProfileComments from "./UserProfileComments";
import UserProfileAbout from "./UserProfileAbout";


const UserProfileTab = ({user}) => {
    const {currentTab} = useContext(UserProfileCurrentTabContext);

    return (
        <>
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
            {/* {
                currentTab === 'Downvoted Posts' &&
                <UserProfileDownvotedPosts />
            } */}
            {
                currentTab === 'About' && 
                <UserProfileAbout about = {user.about} />
            }
        </>
    );
}

export default UserProfileTab;