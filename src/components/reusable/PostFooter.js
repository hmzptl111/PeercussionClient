import VotePost from '../vote/VotePost';

const PostFooter = ({pId, totalComments, votes}) => {
    return <div style = {{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <button>Share</button>
            {
                totalComments > 1 ?
                `${totalComments} comments`:
                totalComments === 0 ?
                'No comments':
                `${totalComments} comment`
            }
        <VotePost pId = {pId} votes = {votes} />
    </div>
}

export default PostFooter;