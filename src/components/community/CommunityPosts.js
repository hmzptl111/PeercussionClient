import PostThumbnail from '../reusable/PostThumbnail';

const CommunityPosts = ({cName, isOwner}) => {
    return cName &&
    <PostThumbnail cName = {cName} isOwner = {isOwner} />
}

export default CommunityPosts;