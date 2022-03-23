import PostThumbnail from '../reusable/PostThumbnail';

const UserProfilePosts = ({uName}) => {
    return uName &&
    <PostThumbnail uName = {uName} />
}

export default UserProfilePosts;