import '../../styles/Comment.css';

const CreateComment = ({comment, setComment, handleCreateComment = null, handleCreateCommentReply = null, uName, replyTo = null, handleCancelCreateCommentReply = null}) => {
    const handleCommentChange = e => {
        setComment(e.target.value);
    }

    return (
        <>
            {
                handleCreateComment &&
                <form onSubmit = {handleCreateComment} className = 'create-comment'>
                    {
                        <>
                            <textarea className = 'comment-input' value = {comment} onChange = {handleCommentChange} placeholder = {`Add a comment${uName && `, ${uName}`}`}></textarea>
                            
                            <input type = 'submit' value = 'Comment' className = 'comment-footer-button' />
                        </>
                    }
                </form>
            }

            {
                handleCreateCommentReply &&
                <form onSubmit = {handleCreateCommentReply} className = 'create-comment'>
                    {
                        <>
                            <textarea className = 'comment-input' value = {comment} onChange = {handleCommentChange} placeholder = {`Reply to ${replyTo}`}></textarea>
                            
                            <input type = 'submit' value = 'Comment' className = 'comment-footer-button' />
                            <div onClick = {handleCancelCreateCommentReply} className = 'comment-footer-button comment-footer-button-cancel '>Cancel</div>
                        </>
                    }
                </form>
            }
        </>
    );
}

export default CreateComment;