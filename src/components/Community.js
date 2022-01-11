import {useCallback, useEffect, useRef, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from 'axios';

import Header from './Header';
import PostFooter from './reusable/PostFooter';

const Community = () => {
    const {cName} = useParams();
    const [community, setCommunity] = useState();
    const [posts, setPosts] = useState([]);
    // const [postsOffset, setPostsOffset] = useState(0);
    const postsOffset = useRef(0);
    // const totalPostIDsReturnedInCurrentBatch = useRef(0);
    const [loading, setLoading] = useState(true);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const observer = useRef();

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

    const fetchPosts = async () => {
        setLoading(true);
        const newPosts = await axios.post(`/community/${cName}`, {
            getPosts: 'affirmative',
            postsOffset: postsOffset.current
        });
        if(newPosts.data.error) {
            console.log(posts.data.error);
            return;
        }
        
        // totalPostIDsReturnedInCurrentBatch.current = newPosts.data.length;
        postsOffset.current += newPosts.data.length;
        // setPostsOffset(previousState => {
        //     return previousState + newPosts.data.length;
        // });
        
        console.log(newPosts.data);
        setPosts(previousState => {
            return [
                ...previousState,
                ...newPosts.data
            ];
        });
        setLoading(false);
        setHasMorePosts(true);
        
        if(newPosts.data.length < 3) {
            setHasMorePosts(false);
            return;
        }

    }

    useEffect(() => {
        console.log(community);
    }, [community]);

    useEffect(() => {
        console.log(cName);
        postsOffset.current = 0;
        // setPostsOffset(0);
        setPosts([]);
        const getCommunityInfo = async () => {
            const community = await axios.post(`/community/${cName}`);
            if(community.data.error) {
                console.log(community.data.error);
                return;
            }
            setCommunity(community.data);
            fetchPosts();
        }
        
        getCommunityInfo();
        // eslint-disable-next-line
    }, [cName]);

        

    const renderThumbnail = block => {
        if(block.thumbnail) {
            return <img key = {block._id} src = {block.thumbnail} alt = {block.title} style = {{width: '100%'}}></img>;
        }
    }

    return (
        <>
            <Header />
            <div style = {{paddingTop: '0.25rem', paddingBottom: '0.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <p style = {{marginLeft: '0.25rem'}}>{cName && cName}</p>
                <button style = {{marginRight: '1.5rem'}}>Follow</button>
            </div>
            <div style = {{paddingLeft: '10rem'}}>
                {
                    posts &&
                    posts.map((post, index) => {
                        if(posts.length === index + 1) {
                                return <div key = {post._id} style = {{marginTop: '1rem', marginBottom: '1rem', border: '1px solid black', width: '60%'}}>
                                            <div ref = {lastPostRef}>
                                                <div>
                                                    <Link to = {`/u/${post.uName}`}>
                                                        {post.uName}
                                                    </Link>
                                                </div>
                                                
                                                <Link to = {'/p/' + post._id}>
                                                    <h2>{post.title}</h2>
                                                    
                                                    {renderThumbnail(post)}
                                                </Link>
                                            </div>

                                            <PostFooter pId = {post._id} votes = {post.upvotes - post.downvotes} />
                                        </div>
                        } else {
                            return <div key = {post._id} style = {{marginTop: '1rem', marginBottom: '1rem', border: '1px solid black', width: '60%'}}>
                                        <div>
                                            <div>
                                                <Link to = {`/u/${post.uName}`}>
                                                    {post.uName}
                                                </Link>
                                            </div>
                                            
                                            <Link to = {'/p/' + post._id}>
                                                <h2>{post.title}</h2>
                                                
                                                {renderThumbnail(post)}
                                            </Link>
                                        </div>

                                        <PostFooter pId = {post._id} votes = {post.upvotes - post.downvotes} />
                                    </div>
                        }
                    })
                }
            </div>
            {loading && 'Please wait...loading'}
            {!hasMorePosts && 'You\'ve reached the end'}
        </>
    )
};

export default Community;