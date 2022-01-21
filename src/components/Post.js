import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import axios from 'axios';

import Header from './Header';
import Comment from './Comment';

import PostFooter from './reusable/PostFooter';

const Post = () => {
    const {pId} = useParams();
    const [postLoaded, setPostLoaded] = useState(false);
    const [post, setPost] = useState();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const result = await axios.post('/post/' + pId);
                console.log(result.data);
                setPost(result.data);

            } catch(e) {
                console.log(e);
            }         

            setPostLoaded(true);
        }

        fetchPost();
    }, [pId]);    

    const renderBlocks = (block) => {
        switch(block.type) {
            case 'paragraph':
                return <p key = {block.id} style = {{marginTop: '0.5em', marginBottom: '0.5em'}}>{block.data.text}</p>;

            case 'header':
                switch(block.data.level) {
                    case 1:
                        return <h1 key = {block.id} style = {{marginTop: '0.5em', marginBottom: '0.5em'}}>{block.data.text}</h1>;
                    case 2:
                        return <h2 key = {block.id} style = {{marginTop: '0.5em', marginBottom: '0.5em'}}>{block.data.text}</h2>;
                    case 3:
                        return <h3 key = {block.id} style = {{marginTop: '0.5em', marginBottom: '0.5em'}}>{block.data.text}</h3>;
                    case 4:
                        return <h4 key = {block.id} style = {{marginTop: '0.5em', marginBottom: '0.5em'}}>{block.data.text}</h4>;
                    case 5:
                        return <h5 key = {block.id} style = {{marginTop: '0.5em', marginBottom: '0.5em'}}>{block.data.text}</h5>;
                    case 6:
                        return <h6 key = {block.id} style = {{marginTop: '0.5em', marginBottom: '0.5em'}}>{block.data.text}</h6>;
                    default:
                        return null;
                }
            
            case 'image':
                return <div key = {block.id} style = {{marginTop: '0.5em', marginBottom: '0.5em'}}>
                            <img src = {block.data.file.url} alt = {block.data.caption}  style = {{width: '100%'}}></img>
                            <div><i>{block.data.caption}</i></div>
                    </div>;

            case 'list':
                if(block.data.style === 'ordered') {
                    return <ol key = {block.id} style = {{marginLeft: '1em', marginTop: '0.5em', marginBottom: '0.5em'}}>
                                {
                                    block.data.items.map((item, index) => (
                                        <li key = {index}>{item}</li>
                                    ))
                                }
                            </ol>;
                } else {
                    return <ul key = {block.id} style = {{marginTop: '0.5em', marginBottom: '0.5em'}}>
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

                    return <table key = {block.id} style = {{borderCollapse: 'collapse', marginTop: '0.5em', marginBottom: '0.5em'}}>
                                <thead>
                                    <tr>
                                        {
                                            headings.map((heading, index) => (
                                                <th key = {index} style = {{backgroundColor: 'lightgrey', border: '2px solid white', borderCollapse: 'collapse', paddingLeft: '1em', paddingRight: '1em', textAlign: 'center'}}>{heading}</th>
                                            ))
                                        }
                                    </tr>
                                </thead>
                                {
                                    <tbody>
                                        {
                                            rows.map((row, index) => (
                                                <tr key = {index}>
                                                    {
                                                        row.map((r, index) => (
                                                            <td key = {index} style = {{border: '2px solid white', backgroundColor: 'lightgrey',borderCollapse: 'collapse', textAlign: 'center'}}>{r}</td>
                                                        ))
                                                    }
                                                </tr>
                                            ))
                                    }
                                    </tbody>
                                }
                        </table>;
                } else {
                    return <table key = {block.id}>
                                {
                                    block.data.content.map((row, index) => (
                                        <tr key = {index}>
                                            {
                                                row.map((r, index) => (
                                                    <td key = {index}>{r}</td>
                                                ))
                                            }
                                        </tr>
                                    ))
                                }
                        </table>;
                }

            case 'warning':
                return <div key = {block.id} style = {{marginTop: '0.5em', marginBottom: '0.5em'}}>
                            <div style = {{color: 'red', fontWeight: 'bold'}}>{block.data.title}</div>
                            <div style = {{color: 'red'}}>{block.data.message}</div>
                    </div>;

            case 'quote':
                return <div key = {block.id} style = {{textAlign: block.data.alignment, marginTop: '0.5em', marginBottom: '0.5em'}}>
                    <div style = {{color: 'blue', fontStyle: 'italic'}}>{block.data.text}</div>  
                    <div style = {{color: 'blue'}}>{block.data.caption}</div>
                </div>;   

            default:
                return null;
        }
    }


    return (
        <>
            <Header />

            {!postLoaded && 'Please wait...loading'}
            
            {
                post &&
                <div style = {{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Link to = {`/u/${post.uName}`}>
                        {post.uName}
                    </Link>
                    <Link to = {`/c/${post.cName}`}>
                        {`c/${post.cName}`}
                    </Link>
                </div>
            }

            {
                post &&
                <div style = {{marginTop: '2em'}}>
                    <h3>{post.title}</h3>

                    {
                        post.body[0].blocks.map(block => (
                            renderBlocks(block)
                        ))
                    }

                </div>
            }

            {
                post &&
                <>
                    <PostFooter pId = {pId} totalComments = {post.totalComments} votes = {post.upvotes - post.downvotes} />

                    <Comment pId = {pId} pTitle = {post.title} cId = {post.cId} cName = {post.cName} setPost = {setPost} />
                </>
            }
        </>
    );
}

export default Post;