import PostThumbnail from '../reusable/PostThumbnail';

const UserProfileUpvotedPosts = ({uName}) => {

    return <PostThumbnail uName = {uName} getUserUpvotedPosts = {true} />
}

export default UserProfileUpvotedPosts;