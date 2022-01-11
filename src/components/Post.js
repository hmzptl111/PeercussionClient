import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
        // return <div>{block.type}</div>;

        switch(block.type) {
            case 'paragraph':
                return <p key = {block.id}>{block.data.text}</p>;

            case 'header':
                switch(block.data.level) {
                    case 1:
                        return <h1 key = {block.id}>{block.data.text}</h1>;
                    case 2:
                        return <h2 key = {block.id}>{block.data.text}</h2>;
                    case 3:
                        return <h3 key = {block.id}>{block.data.text}</h3>;
                    case 4:
                        return <h4 key = {block.id}>{block.data.text}</h4>;
                    case 5:
                        return <h5 key = {block.id}>{block.data.text}</h5>;
                    case 6:
                        return <h6 key = {block.id}>{block.data.text}</h6>;
                    default:
                        return null;
                }
            
            case 'image':
                return <img key = {block.id} src = {block.data.file.url} alt = {block.data.caption} style = {{width: '100%'}}></img>;

            case 'list':
                if(block.data.style === 'ordered') {
                    return <ol key = {block.id} style = {{marginLeft: '20px'}}>
                                {
                                    block.data.items.map((item, index) => (
                                        <li key = {index}>{item}</li>
                                    ))
                                }
                            </ol>;
                } else {
                    return <ul key = {block.id}>
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

                    return <table key = {block.id}>
                                <thead>
                                    <tr>
                                        {
                                            headings.map((heading, index) => (
                                                <th key = {index}>{heading}</th>
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
                                                            <td key = {index}>{r}</td>
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
                    return <div key = {block.id}>
                                <div style = {{color: 'red'}}>{block.data.title}</div>
                                <div style = {{color: 'red'}}>{block.data.message}</div>
                        </div>;

                case 'quote':
                    return <div key = {block.id} style = {{textAlign: block.data.alignment}}>
                        <div style = {{color: 'blue'}}>{block.data.text}</div>  
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
                <>  
                    <div>
                        <div>{post.cId}</div>
                        <div>{post.title}</div>

                        {
                            post.body[0].blocks.map(block => (
                                renderBlocks(block)
                            ))
                        }

                    </div>
                </>
            }

            {post &&
            <PostFooter pId = {pId} votes = {post.upvotes - post.downvotes} />}

            <Comment pId = {pId} />
        </>
    );
}

export default Post;