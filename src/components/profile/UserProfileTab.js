import { useContext } from "react";

import { UserProfileCurrentTabContext } from "../../contexts/UserProfileCurrentTab";

import UserProfilePosts from "./UserProfilePosts";
import UserProfileFriends from "./UserProfileFriends";
import UserProfileComments from "./UserProfileComments";
import UserProfilePendingRequests from "./UserProfilePendingRequests";


const UserProfileTab = ({uName}) => {
    const {currentTab} = useContext(UserProfileCurrentTabContext);

    return (
        <>
            {
                currentTab === 'Posts' &&
                <UserProfilePosts uName = {uName} />
            }
            {
                currentTab === 'Friends' &&
                <UserProfileFriends uName = {uName} />
            }
            {
                currentTab === 'Comments' &&
                <UserProfileComments uName = {uName} />
            }
            {
                currentTab === 'Pending Requests' &&
                <UserProfilePendingRequests />
            }
            {currentTab === 'About' && 'viewing about'}
        </>
    );
}

export default UserProfileTab;