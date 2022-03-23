import { useContext } from 'react';

import { UserProfileCurrentTabContext } from '../../contexts/UserProfileCurrentTab';
import { UserAuthStatusContext } from '../../contexts/UserAuthStatus';

import { ReactComponent as PostIcon } from '../../images/post.svg';
import { ReactComponent as FriendsIcon } from '../../images/friends.svg';
import { ReactComponent as ModeratorIcon } from '../../images/settings.svg';
import { ReactComponent as FollowingCommunitiesIcon } from '../../images/bulb.svg';
import { ReactComponent as PendingRequestsIcon } from '../../images/pending.svg';
import { ReactComponent as UpvotedIcon } from '../../images/upvoted.svg';
import { ReactComponent as CommentsIcon } from '../../images/comments.svg';
import { ReactComponent as AboutIcon } from '../../images/about.svg';


const UserProfileNav = ({uName}) => {
    const {currentTab, setCurrentTab} = useContext(UserProfileCurrentTabContext);
    const {user} = useContext(UserAuthStatusContext);


    return <div className = 'navigation-bar'>
    <div onClick = {() => setCurrentTab('Posts')} className = {`navigation-bar-item ${currentTab === 'Posts' && 'current-tab'}`}>
        <PostIcon />
        Posts
    </div>
    
    <div onClick = {() => setCurrentTab('Friends')} className = {`navigation-bar-item ${currentTab === 'Friends' && 'current-tab'}`}>
        <FriendsIcon />
        Friends
    </div>

    <div onClick = {() => setCurrentTab('Upvoted Posts')} className = {`navigation-bar-item ${currentTab === 'Upvoted Posts' && 'current-tab'}`}>
        <UpvotedIcon />
        Upvoted Posts
    </div>

    <div onClick = {() => setCurrentTab('Comments')} className = {`navigation-bar-item ${currentTab === 'Comments' && 'current-tab'}`}>
        <CommentsIcon />
        Comments
    </div>

    {
        user && uName === user.uName &&
        <div onClick = {() => setCurrentTab('Pending Requests')} className = {`navigation-bar-item ${currentTab === 'Pending Requests' && 'current-tab'}`}>
            <PendingRequestsIcon />
            Pending Requests
        </div>
    }

    <div onClick = {() => setCurrentTab('Moderates Communities')} className = {`navigation-bar-item ${currentTab === 'Moderates Communities' && 'current-tab'}`}>
        <ModeratorIcon />
        Moderates Communities
    </div>
    
    <div onClick = {() => setCurrentTab('Following Communities')} className = {`navigation-bar-item ${currentTab === 'Following Communities' && 'current-tab'}`}>
        <FollowingCommunitiesIcon />
        Following Communities
    </div>
    
    <div onClick = {() => setCurrentTab('About')} className = {`navigation-bar-item ${currentTab === 'About' && 'current-tab'}`}>
        <AboutIcon />
        About
    </div>
</div>
}

export default UserProfileNav;