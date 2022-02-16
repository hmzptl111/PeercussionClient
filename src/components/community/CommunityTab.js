import { useContext } from "react";

import { CommunityCurrentTabContext } from "../../contexts/CommunityCurrentTab";

import CommunityPosts from './CommunityPosts';
import CommunityRelatedCommunities from './CommunityRelatedCommunities';
import CommunityRestrictedUsers from './CommunityRestrictedUsers';
import CommunityDescription from './CommunityDescription';
import { UserAuthStatusContext } from "../../contexts/UserAuthStatus";

const CommunityTab = ({community}) => {
    const {user} = useContext(UserAuthStatusContext);
    const {currentTab} = useContext(CommunityCurrentTabContext);

    return (
        <>
            {
                currentTab === 'Posts' &&
                <CommunityPosts cName = {community.cName} />
            }
            {
                currentTab === 'Related Communities' &&
                <CommunityRelatedCommunities cName = {community.cName} />
            }
            {
                currentTab === 'Restricted Users' &&
                <CommunityRestrictedUsers cName = {community.cName} isModerator = {user ? community.mId === user.uId: false} />
            }
            {
                currentTab === 'Description' && 
                <CommunityDescription desc = {community.desc} />
            }
        </>
    );
}

export default CommunityTab;