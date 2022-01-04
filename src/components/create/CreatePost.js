import {useEffect, useRef, useState} from 'react';
import axios from 'axios';
// import '../../styles/create/CreatePost.css';

import {default as Head} from '../Header';

import EditorJs from '@editorjs/editorjs';
// import Link from '@editorjs/link';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import Warning from '@editorjs/warning';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import Underline from '@editorjs/underline';
import ImageTool from '@editorjs/image';

const CreatePost = () => {
    let editor = useRef();
    const [postCId, setPostCId] = useState();
    const [postCommunity, setPostCommunity] = useState('');
    const [suggestedCommunities, setSuggestedCommunities] = useState([]);
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState([]);
    // const postBodyRef = useRef();

   useEffect(() => {
    initEditor();
   }, []);

   const initEditor = () => {
    editor.current = new EditorJs({
        holder: 'editorjs',
        stretched: false,
        tools: {
            header: {
                class: Header,
                inlineToolbar: true,
                shortcut: 'CMD+SHIFT+H'
            },
            // link: Link //use links for mentions like @user123
            list: {
                class: List,
                inlineToolbar: true,
                shortcut: 'CMD+SHIFT+L'
            },
            embed: Embed,
            table: {
                class: Table,
                inlineToolbar: true,
                shortcut: 'CMD+SHIFT+T'
            },
            warning: {
                class: Warning,
                config: {
                    titlePlaceholder: 'Title',
                    messagePlaceholder: 'Message',
                },
                shortcut: 'CMD+SHIFT+W'
            },
            quote: {
                class: Quote,
                inlineToolbar: true,
                config: {
                    quotePlaceholder: 'Enter a quote',
                    captionPlaceholder: 'Quote\'s author',
                },
                shortcut: 'CMD+SHIFT+Q'
            },
            marker: { //Marked text will be wrapped with a <mark> tag with an "cdx-marker" class.
                class: Marker,
                shortcut: 'CMD+SHIFT+M'
            },
            inlineCode: { //Marked text will be wrapped with a <span> tag with an "inline-code" class.
                class: InlineCode,
                shortcut: 'CMD+ALT+M'
            },
            underline: {
                class: Underline,
                shortcut: 'CMD+U'
            }, //Underlined text will be wrapped with a u tag with an cdx-underline class.
            image: {
                class: ImageTool,
                config: {
                  endpoints: {
                      //dragndrop and copy from clipboard are also handled by byFile endpoint
                      byFile: '/images/postBodyImageFromDevice',
                      byUrl: '/images/postBodyImageFromUrl'
                  },
                  field: 'postBodyImage'
                }
            }
        },
        // onReady: () => console.log('Editor.js is ready'),
        onChange:  () => {
            editor.current.save()
            .then(data => {
                setPostBody(data)
            })
        }
    });
   }

   

    const containsSpecialChar = str => {
        const pattern = /\W/g;
        return pattern.test(str);
    }

    useEffect(() => {
        let cancelRequestToken;
        if(postCommunity === '') {
            setSuggestedCommunities([]);
            return;
        }

        axios.post('/search/community', {text: postCommunity}, {
            cancelToken: new axios.CancelToken(c => cancelRequestToken = c)
        })
        .then(result => {
            console.log(result);
            setSuggestedCommunities(result.data);
        })
        .catch(err => {
            if(axios.isCancel(err)) return;
            console.log(err);
        });

        return () => {
            cancelRequestToken();
        }

        // const getSuggestions = async () => {
        //     if(postCommunity === '') {
        //         setSuggestedCommunities([]);
        //         return;
        //     }

        //     const result = await axios.post('/search/community', {text: postCommunity});
        //     setSuggestedCommunities(result.data);
        // };
        // getSuggestions();

    }, [postCommunity]);

    const handlePostTitle = e => {
        setPostTitle(e.target.value);
    }
    
    const setAsPostCommunity = e => {
        setPostCId(e.target.dataset.c_id);

        setPostCommunity(e.target.dataset.c_name);
        setSuggestedCommunities([]);
    }

    const handlePostCommunity = e => {
        const isInvalid = containsSpecialChar(e.target.value.substr(-1));
        
        if(isInvalid) return;

        setPostCommunity(e.target.value);
    }

    const handleCreatePost = async (e) => {
        e.preventDefault();

        let tempPostInfo = {
            cId: postCId,
            // cName: postCommunity,
            title: postTitle,
            body: postBody
        }

        console.log(tempPostInfo);
        await axios.post('/create/post', tempPostInfo);

        setPostBody(null);
        setPostTitle('');
        setPostCId(null);
        setPostCommunity('');

        document.querySelector('#editorjs').innerHTML = '';
        initEditor();
    };


    return(
        <>
            <Head />

            <form onSubmit = {handleCreatePost}>
            <input type = 'text' onChange = {handlePostTitle} placeholder = 'title' value = {postTitle} />

            <input type = 'text' onChange = {handlePostCommunity} placeholder = 'community' value = {postCommunity} />

            {
                suggestedCommunities !== [] &&
                <ul>
                    {
                        suggestedCommunities.map(sc => {
                            let isSetAsPostCommunity = (sc._id === postCId);
                            
                            if(isSetAsPostCommunity) return null;
                            
                            return <li key = {sc._id} data-c_id = {sc._id} data-c_name = {sc.cName} onClick = {setAsPostCommunity}>{sc.cName}</li>
                        })
                    }
                </ul>
            }

            <div id = 'editorjs' style = {{border: '1px solid black'}}></div>

            <input type = 'submit' value = 'Create' />
        </form>
        </>
    );
};

export default CreatePost;