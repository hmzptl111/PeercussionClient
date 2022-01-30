import GetCommunities from '../reusable/GetCommunities';

const CommunityRelatedCommunities = ({cName}) => {
    return <GetCommunities cName = {cName} type = 'related' />
}

export default CommunityRelatedCommunities;