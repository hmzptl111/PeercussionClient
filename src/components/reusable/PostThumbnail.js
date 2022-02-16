import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"

import axios from "axios";

import PostFooter from "./PostFooter"

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../reusable/PopUp';

const PostThumbnail = ({cName, uName, home, getUserUpvotedPosts = false}) => {
    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [hasMorePosts, setHasMorePosts] = useState(true);

    const postsOffset = useRef(0);
    const observer = useRef();

    const controller = new AbortController();
    const {signal} = controller;

    const fetchPosts = async () => {
        setLoading(true);
        let newPosts;
        
        if(home) {
            newPosts = await axios.post('/postThumbnail/home', {
                postsOffset: postsOffset.current
            }, {signal: signal});
        } else if(cName) {
            newPosts = await axios.post('/postThumbnail/community', {
                communityName: cName,
                postsOffset: postsOffset.current
            }, {signal: signal});
        } else if(uName) {
            if(!getUserUpvotedPosts) {
                newPosts = await axios.post('/postThumbnail/user', {
                    uName: uName,
                    postsOffset: postsOffset.current
                }, {signal: signal});
            } else {
                newPosts = await axios.post('/getUpvotedPosts', {
                    uName: uName,
                    postsOffset: postsOffset.current
                }, {signal: signal});
            }
        }

        if(newPosts.data.error) {
            let errorPopup = PopUp('Something went wrong', newPosts.data.error);
            PopUpQueue(errorPopup);
            return;
        }
        
        postsOffset.current += newPosts.data.message.length;        
        console.log(newPosts.data.message);

        setPosts(previousState => {
            return [
                ...previousState,
                ...newPosts.data.message
            ];
        });
        setLoading(false);
        
        if(newPosts.data.message.length < 3) {
            setHasMorePosts(false);
            return;
        }
        
        setHasMorePosts(true);
    }

    const lastPostRef = useCallback(node => {
        if(loading) return;

        observer.current && observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMorePosts) {
                fetchPosts();
            }
        });

        if(node) {
            observer.current.observe(node);
        }
        // eslint-disable-next-line
    }, [loading, hasMorePosts]);

    const renderThumbnail = block => {
        if(block.thumbnail) {
            return <img key = {block._id} src = {block.thumbnail} alt = {block.title} style = {{width: '100%'}}></img>;
        }
    }

    useEffect(() => {
        postsOffset.current = 0;
        setPosts([]);
        
        fetchPosts();

        return () => controller.abort();
        // eslint-disable-next-line
    }, [cName, uName]);

    return <>
            <div style = {{display: 'flex', flexWrap: 'wrap', gap: '5rem', justifyContent: 'center', alignItems: 'center'}}>
                {
                    posts.length > 0 ?
                    posts.map((post, index) => {
                        if(posts.length === index + 1) {
                                return <div key = {post._id} style = {{marginTop: '1rem', marginBottom: '1rem', border: '1px solid black', width: '40%'}}>
                                            <div ref = {lastPostRef}>
                                                <div style = {{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                    <Link to = {`/u/${post.uName}`}>
                                                        {post.uName}
                                                    </Link>

                                                    {
                                                        !cName &&
                                                        <Link to = {`/c/${post.cName}`}>
                                                            {`c/${post.cName}`}
                                                        </Link>
                                                    }
                                                </div>
                                                
                                                <Link to = {'/p/' + post._id}>
                                                    <h2>{post.title}</h2>
                                                    
                                                    {renderThumbnail(post)}
                                                </Link>
                                            </div>

                                            <PostFooter pId = {post._id} pTitle = {post.title} pThumbnail = {post.thumbnail} uName = {post.uName} pCName = {post.cName} totalComments = {post.totalComments} votes = {post.upvotes - post.downvotes} />
                                        </div>
                        } else {
                            return <div key = {post._id} style = {{marginTop: '1rem', marginBottom: '1rem', border: '1px solid black', width: '40%'}}>
                                        <div>
                                            <div style = {{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <Link to = {`/u/${post.uName}`}>
                                                    {post.uName}
                                                </Link>

                                                {
                                                    !cName &&
                                                    <Link to = {`/c/${post.cName}`}>
                                                        {`c/${post.cName}`}
                                                    </Link>
                                                }
                                            </div>
                                            
                                            <Link to = {'/p/' + post._id}>
                                                <h2>{post.title}</h2>
                                                
                                                {renderThumbnail(post)}
                                            </Link>
                                        </div>

                                        <PostFooter pId = {post._id} pTitle = {post.title} pThumbnail = {post.thumbnail} uName = {post.uName} pCName = {post.cName} totalComments = {post.totalComments} votes = {post.upvotes - post.downvotes} />
                                    </div>
                        }
                    }):
                    'No posts'
                }
            </div>
            {loading && 'Please wait...loading'}
            {
                !hasMorePosts && posts.length > 0 &&
                'You\'ve reached the end'
            }

            <Popup />
            </>
}

export default PostThumbnail;