import { useContext } from 'react';

import { CommunityCurrentTabContext } from '../../contexts/CommunityCurrentTab';

import CommunityPosts from './CommunityPosts';
import CommunityRelatedCommunities from './CommunityRelatedCommunities';
import CommunityRestrictedUsers from './CommunityRestrictedUsers';
import CommunityDescription from './CommunityDescription';


const CommunityTab = ({community, isOwner, setCommunity}) => {
    const {currentTab} = useContext(CommunityCurrentTabContext);

    return <>
    {
        currentTab === 'Posts' &&
        <CommunityPosts cName = {community.cName} isOwner = {isOwner} />
    }
    {
        currentTab === 'Related Communities' &&
        <CommunityRelatedCommunities cId = {community._id} cName = {community.cName} relatedCommunities = {community.relatedCommunities} isOwner = {isOwner} setCommunity = {setCommunity} />
    }
    {
        currentTab === 'Restricted Users' &&
        <CommunityRestrictedUsers cName = {community.cName} isOwner = {isOwner} setCommunity = {setCommunity} />
    }
    {
        currentTab === 'Description' && 
        <CommunityDescription cName = {community.cName} desc = {community.desc} isOwner = {isOwner} setCommunity = {setCommunity} />
    }
</>
}

export default CommunityTab;