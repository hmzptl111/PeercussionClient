import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"

import axios from "axios";

import PostFooter from "./PostFooter"

const PostThumbnail = ({cName, uName}) => {
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
        
        if(cName) {
            newPosts = await axios.post('/postThumbnail/community', {
                communityName: cName,
                postsOffset: postsOffset.current
            }, {signal: signal});
        } else if(uName) {
            newPosts = await axios.post('/postThumbnail/user', {
                uName: uName,
                postsOffset: postsOffset.current
            }, {signal: signal});
        }

        if(newPosts.data.error) {
            console.log(posts.data.error);
            return;
        }
        
        postsOffset.current += newPosts.data.length;        
        console.log(newPosts.data);

        setPosts(previousState => {
            return [
                ...previousState,
                ...newPosts.data
            ];
        });
        setLoading(false);
        
        if(newPosts.data.length < 3) {
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

    return <div>
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
                                                        uName &&
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

                                            <PostFooter pId = {post._id} totalComments = {post.totalComments} votes = {post.upvotes - post.downvotes} />
                                        </div>
                        } else {
                            return <div key = {post._id} style = {{marginTop: '1rem', marginBottom: '1rem', border: '1px solid black', width: '40%'}}>
                                        <div>
                                            <div style = {{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <Link to = {`/u/${post.uName}`}>
                                                    {post.uName}
                                                </Link>

                                                {
                                                    uName &&
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

                                        <PostFooter pId = {post._id} totalComments = {post.totalComments} votes = {post.upvotes - post.downvotes} />
                                    </div>
                        }
                    }):
                    'No posts'
                }

                {loading && 'Please wait...loading'}
                {
                    !hasMorePosts && posts.length > 0 &&
                    'You\'ve reached the end'
                }
            </div>
}

export default PostThumbnail;