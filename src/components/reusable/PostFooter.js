import VotePost from "./VotePost";

const PostFooter = ({pId, votes}) => {
    return <div style = {{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <button>Share</button>
        <VotePost pId = {pId} votes = {votes} />
    </div>
}

export default PostFooter;