const CreateComment = ({comment, setComment, handleCreateComment = null, handleCreateCommentReply = null, uName, replyTo = null, handleCancelCreateCommentReply = null}) => {
    const handleCommentChange = e => {
        setComment(e.target.value);
    }

    return (
        <>
            {
                handleCreateComment &&
                <form onSubmit = {handleCreateComment}>
                    {
                        <>
                            <textarea style = {{resize: 'none', width: '100%', height: '10em', padding: '0.25em'}} value = {comment} onChange = {handleCommentChange} placeholder = {`Add a comment, ${uName}`}></textarea>
                            
                            <input type = 'submit' value = 'Comment' />
                        </>
                    }
                </form>
            }

            {
                handleCreateCommentReply &&
                <form onSubmit = {handleCreateCommentReply}>
                    {
                        <>
                            <textarea style = {{resize: 'none', width: '100%', height: '5em', padding: '0.25em'}} value = {comment} onChange = {handleCommentChange} placeholder = {`Reply to ${replyTo}`}></textarea>
                            
                            <input type = 'submit' value = 'Comment' />
                            <button onClick = {handleCancelCreateCommentReply}>Cancel</button>
                        </>
                    }
                </form>
            }
        </>
    );
}

export default CreateComment;