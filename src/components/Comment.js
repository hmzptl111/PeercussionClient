import {useContext, useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';

import {UserAuthStatusContext} from '../contexts/UserAuthStatus';

import axios from 'axios';

import CreateComment from './create/CreateComment';
import VoteComment from './vote/VoteComment';

const Comment = ({pId, pTitle, cId, cName, setPost}) => {
    const {user} = useContext(UserAuthStatusContext);
    
    const [postComments, setPostComments] = useState([]);
    const [commentsOffset, setCommentsOffset] = useState(0);
    const totalCommentsReturnedInCurrentBatch = useRef(0);
    const [hasMoreComments, setHasMoreComments] = useState(true);

    const [comment, setComment] = useState('');

    const [commentReply, setCommentReply] = useState('');
    const replyTo = useRef('');


    useEffect(() => {
        handleLoadMoreComments();

        // eslint-disable-next-line
    }, [pId]);

    const handleLoadMoreComments = async () => {
        const newComments = await axios.post('/comments', {
            pId: pId,
            commentsOffset: commentsOffset
        });
        
        totalCommentsReturnedInCurrentBatch.current = newComments.data.length;
        setCommentsOffset(previousState => {
            return previousState + newComments.data.length;
        });
        console.log(newComments.data);
        
        setPostComments(previousState => {
            return [
                ...previousState,
                ...newComments.data
            ];
        });
        
        if(newComments.data.length < 3) {
            setHasMoreComments(false);
            return;
        }
    }

    const handleLoadCommentReplies = async (e, postComment) => {
        e.preventDefault();
        console.log(e.target);
        console.log(postComment);
        if(e.target.textContent === 'Hide replies') {
            e.target.textContent = `${postComment.replies.length} Replies`;
            postComment.replies = [];
            setPostComments(previousState => {
                let postComments = [...previousState];
                for(let i = 0; i < postComments.length; i++) {
                    if(postComments[i] === postComment) {
                        postComments[i].replies = [];
                        break;
                    }
                }
                return postComments;
            });
        } else {
            e.target.textContent = 'Hide replies';
            const newComments = await axios.post('/comments', {
                replyTo: postComment._id
            });
            console.log(newComments.data);
            setPostComments(previousState => {
                let postComments = [...previousState];
                for(let i = 0; i < postComments.length; i++) {
                    if(postComments[i] === postComment) {
                        postComments[i].replies = [...newComments.data];
                        break;
                    }
                }
                return postComments;
            });
        }

    }

    const handleCreateComment = async (e) => {
        e.preventDefault();

        const payload = {
            pId: pId,
            pTitle: pTitle,
            cId: cId,
            cName: cName,
            comment: comment
        };

        const response = await axios.post('/createComment', payload);
        console.log(response.data);

        setPost(previousState => {
            return {
                ...previousState,
                totalComments: previousState.totalComments + 1
            };
        });
        
        setComment('');

        setPostComments(previousState => {
            return [
                response.data,
                ...previousState,
            ];
        });
    }

    const handleCreateCommentReply = async (e, postComment) => {
        e.preventDefault();

        const payload = {
            pId: pId,
            pTitle: pTitle,
            cId: cId,
            cName: cName,
            comment: commentReply,
            replyTo: replyTo.current
        };

        const newReply = await axios.post('/createComment', payload);
        console.log(newReply.data);

        console.log(postComment);
        console.log(postComments);

        let currentPostComments = postComments;
        // let previousPostComments = [...previousState];
        for(let i = 0; i < currentPostComments.length; i++) {
            if(currentPostComments[i] === postComment) {
                let currentComment = currentPostComments[i];
                let currentCommentReplies = currentComment.replies;
                currentComment.replies = [newReply.data, ...currentCommentReplies];
            }
        }
        setPostComments(currentPostComments);

        setCommentReply('');
        handleCancelCreateCommentReply(e, postComment._id);
    }
    
    const handleCommentReply = (e, cId) => {
        e.preventDefault();
        
        setCommentReply('');
        replyTo.current = cId;
        for(let x = 0; x < document.getElementsByClassName('comment-reply').length; x++) {
            console.log(document.getElementsByClassName('comment-reply')[x]);
            document.getElementsByClassName('comment-reply')[x].style.display = 'none';
        }
        document.getElementById(`${cId}-reply`).style.display = 'block';
    }


    const handleCancelCreateCommentReply = (e, cId) => {
        e.preventDefault();

        document.getElementById(`${cId}-reply`).style.display = 'none';
        setCommentReply('');
    }

    useEffect(() => {
        console.log(postComments);
    }, [postComments]);

    return (
        <div>
            {
                user &&
                <CreateComment comment = {comment} setComment = {setComment} handleCreateComment = {handleCreateComment} uName = {user.uName} />

            }
                {
                    postComments.map(c => {
                        return <div key = {c._id} style = {{marginTop: '0.5em', marginBottom: '0.5em'}}>
                                    <div>
                                        <Link to = {`/u/${c.uName}`} style = {{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                                            {
                                                c.uProfilePicture &&
                                                <img src = {`/uploads/profilePictures/${c.uProfilePicture}`} width = '20em' height = '20em' style = {{borderRadius: '50%'}} alt = '' />
                                            }
                                            <p>{c.uName}</p>
                                            </Link>
                                    </div>
                                    
                                    {c.comment}

                                    <div>
                                        <button onClick = {e => handleLoadCommentReplies(e, c)}>{c.replies.length} Replies</button>
                                        <button onClick = {e => handleCommentReply(e, c._id)}>Reply</button>
                                        
                                        <VoteComment cId = {c._id} votes = {c.upvotes - c.downvotes} />
                                    </div>
                                    
                                    <div id = {`${c._id}-reply`} className = 'comment-reply' style = {{display: 'none'}}>
                                        <CreateComment comment = {commentReply} setComment = {setCommentReply} handleCreateCommentReply = {e => handleCreateCommentReply(e, c)} uName = {user.uName} replyTo = {c.uName} handleCancelCreateCommentReply = {e => handleCancelCreateCommentReply(e, c._id)} />
                                    </div>

                                    {
                                        c.replies !== [] &&
                                        <div style = {{paddingLeft: '1em'}}>
                                            {
                                                c.replies.map(reply => {
                                                    if(!reply.comment) return null;
                                                    return <div key = {reply._id} style = {{marginTop: '0.5em', marginBottom: '0.5em'}}>
                                                        <div>
                                                            <Link to = {`/u/${reply.uName}`} style = {{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                                                            {
                                                                reply.uProfilePicture &&
                                                                <img src = {`/uploads/profilePictures/${reply.uProfilePicture}`} width = '20em' height = '20em' style = {{borderRadius: '50%'}} alt = '' />
                                                            }
                                                                <span>{reply.uName}</span>
                                                                </Link>
                                                        </div>
                                                        
                                                        <div>{reply.comment}</div>
                                                        <VoteComment cId = {reply._id} votes = {reply.upvotes - reply.downvotes} />
                                                    </div>
                                                })
                                            }
                                        </div>
                                    }
                                </div>;
                    })
                }
                {
                    hasMoreComments &&
                    <button onClick = {handleLoadMoreComments}>Load more</button>
                }
            </div>
    );
}

export default Comment;