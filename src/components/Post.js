import '../styles/Post.css';

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import axios from 'axios';

import Header from './Header';
import Comment from './Comment';
import PostFooter from './reusable/PostFooter';
import GeneralProfileIcon from './reusable/GeneralProfileIcon';
import InitialsIcon from './reusable/InitialsIcon';

import { PopUp, PopUpQueue } from './reusable/PopUp';


const Post = () => {
    const {pId} = useParams();

    const [postLoaded, setPostLoaded] = useState(false);
    const [post, setPost] = useState();

    useEffect(() => {
        const fetchPost = async () => {
            const result = await axios.post('/post/' + pId);

            if(result.data.error) {
                let errorPopup = PopUp('Something went wrong', result.data.error);
                PopUpQueue(errorPopup);
                return;
            }

            setPost(result.data.message);
            setPostLoaded(true);
        }

        fetchPost();
    }, [pId]);    

    const renderBlocks = (block) => {
        switch(block.type) {
            case 'paragraph':
                return <p key = {block.id} className = 'post-body-paragraph'>{block.data.text}</p>;

            case 'header':
                switch(block.data.level) {
                    case 1:
                        return <h1 key = {block.id} className = 'post-body-heading'>{block.data.text}</h1>;
                    case 2:
                        return <h2 key = {block.id} className = 'post-body-heading'>{block.data.text}</h2>;
                    case 3:
                        return <h3 key = {block.id} className = 'post-body-heading'>{block.data.text}</h3>;
                    case 4:
                        return <h4 key = {block.id} className = 'post-body-heading'>{block.data.text}</h4>;
                    case 5:
                        return <h5 key = {block.id} className = 'post-body-heading'>{block.data.text}</h5>;
                    case 6:
                        return <h6 key = {block.id} className = 'post-body-heading'>{block.data.text}</h6>;
                    default:
                        return null;
                }
            
            case 'image':
                return <div key = {block.id} className = 'post-body-image-container'>
                            <img src = {block.data.file.url} alt = {block.data.caption} className = 'post-body-image'></img>
                            <div className = 'post-body-image-caption'><i>{block.data.caption}</i></div>
                    </div>;

            case 'list':
                if(block.data.style === 'ordered') {
                    return <ol key = {block.id} className = 'post-body-ordered-list'>
                                {
                                    block.data.items.map((item, index) => (
                                        <li key = {index}>{item}</li>
                                    ))
                                }
                            </ol>;
                } else {
                    return <ul key = {block.id} className = 'post-body-unordered-list'>
                                {
                                    block.data.items.map((item, index) => (
                                        <li key = {index}>{item}</li>
                                    ))
                                }
                            </ul>;
                }

            case 'table':
                if(block.data.withHeadings) {
                    const headings = block.data.content[0];
                    const rows = block.data.content.slice(1);

                    return <div className = 'post-body-table-container'>
                                <table key = {block.id} className = 'post-body-table'>
                                    <thead className = 'post-body-table-head'>
                                        <tr className = 'post-body-table-row'>
                                            {
                                                headings.map((heading, index) => (
                                                    <th key = {index} className = 'post-body-table-row-head'>{heading}</th>
                                                ))
                                            }
                                        </tr>
                                    </thead>
                                    {
                                        <tbody className = 'post-body-table-body'>
                                            {
                                                rows.map((row, index) => (
                                                    <tr key = {index} className = 'post-body-table-row'>
                                                        {
                                                            row.map((r, index) => (
                                                                <td key = {index} className = 'post-body-table-data'>{r}</td>
                                                            ))
                                                        }
                                                    </tr>
                                                ))
                                        }
                                        </tbody>
                                    }
                            </table>
                        </div>;
                } else {
                    return <div className = 'post-body-table-container'>
                                <table key = {block.id} className = 'post-body-table'>
                                {
                                    block.data.content.map((row, index) => (
                                        <tr key = {index} className = 'post-body-table-row'>
                                            {
                                                row.map((r, index) => (
                                                    <td key = {index} className = 'post-body-table-data'>{r}</td>
                                                ))
                                            }
                                        </tr>
                                    ))
                                }
                        </table>
                    </div>;
                }

            case 'warning':
                return <div className = 'post-body-spoiler-container'>
                            <div key = {block.id} className = 'post-body-spoiler'>
                                <div className = 'post-body-spoiler-title'>{block.data.title}</div>
                                <div className = 'post-body-spoiler-message'>{block.data.message}</div>
                            </div>
                        </div>;

            case 'quote':
                return <div className = 'post-body-quote-container'>
                            <div key = {block.id} className = 'post-body-quote'>
                                <div className = 'post-body-quote-text'>{`"${block.data.text}"`}</div>  
                                <div className = 'post-body-quote-author'>{`-${block.data.caption}`}</div>
                            </div>
                        </div>;  
            default:
                return null;
        }
    }


    return (
        <>
            <Header />

            <div className = 'post'>
                {!postLoaded && 'Please wait...loading'}
    
                {
                    post &&
                    <>
                        <div className = 'post-header'>
                            <Link to = {`/u/${post.uName}`} className = 'post-header-link post-header-user'>
                                {
                                    post.uProfilePicture ?
                                    <GeneralProfileIcon imageSource = 'profilePictures' imageID = {post.uProfilePicture} />:
                                    <InitialsIcon initial = {post.uName[0]} />
                                }
                                {post.uName}
                            </Link>
                            <Link to = {`/c/${post.cName}`} className = 'post-header-community'>
                                {`c/${post.cName}`}
                            </Link>
                        </div>
                    
                        <div>
                            <h3 className = 'post-title'>{post.title && post.title}</h3>

                            <div className = 'post-body'>
                                {
                                    post.body[0] && post.body[0].blocks.map(block => (
                                        renderBlocks(block)
                                    ))
                                }
                            </div>

                            <PostFooter pId = {pId} pTitle = {post.title} pThumbnail = {post.thumbnail} uName = {post.uName} pCName = {post.cName} totalComments = {post.totalComments} votes = {post.upvotes - post.downvotes} isUpvoted = {post.isUpvoted} isDownvoted = {post.isDownvoted} />

                            <Comment pId = {pId} pTitle = {post.title} cId = {post.cId} cName = {post.cName} setPost = {setPost} />
                        </div>
                    </>
                }
            </div>
        </>
    );
}

export default Post;