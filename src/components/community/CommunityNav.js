import '../../styles/reusable/Nav.css';

import { useContext } from 'react';

import { CommunityCurrentTabContext } from '../../contexts/CommunityCurrentTab';

import {ReactComponent as PostIcon} from '../../images/post.svg';
import {ReactComponent as RelationIcon} from '../../images/nodes.svg';
import {ReactComponent as RestrictedIcon} from '../../images/restricted.svg';
import {ReactComponent as DescriptionIcon} from '../../images/description.svg';

const UserProfileNav = () => {
    const {currentTab, setCurrentTab} = useContext(CommunityCurrentTabContext);

    return <div className = 'navigation-bar'>
    <div onClick = {() => setCurrentTab('Posts')} className = {`navigation-bar-item ${currentTab === 'Posts' && 'current-tab'}`}>
        <PostIcon />
        Posts
    </div>

    <div onClick = {() => setCurrentTab('Related Communities')} className = {`navigation-bar-item ${currentTab === 'Related Communities' && 'current-tab'}`}>
        <RelationIcon />
        Related Communities
    </div>

    <div onClick = {() => setCurrentTab('Restricted Users')} className = {`navigation-bar-item ${currentTab === 'Restricted Users' && 'current-tab'}`}>
        <RestrictedIcon />
        Restricted Users
    </div>

    <div onClick = {() => setCurrentTab('Description')} className = {`navigation-bar-item ${currentTab === 'Description' && 'current-tab'}`}>
        <DescriptionIcon />
        Description
    </div>
</div>
}

export default UserProfileNav;