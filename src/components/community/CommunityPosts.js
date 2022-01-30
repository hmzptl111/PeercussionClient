import PostThumbnail from '../reusable/PostThumbnail';

const CommunityPosts = ({cName}) => {
    return <>
                {
                    cName &&
                    <PostThumbnail cName = {cName} />
                }
            </>
}

export default CommunityPosts;