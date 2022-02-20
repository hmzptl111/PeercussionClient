import '../../styles/create/Create.css';

import {useEffect, useRef, useState} from 'react';
import axios from 'axios';

import { useHistory } from 'react-router-dom';

import BackButton from '../reusable/BackButton';

import EditorJs from '@editorjs/editorjs';
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

import GeneralProfileIcon from '../reusable/GeneralProfileIcon';
import InitialsIcon from '../reusable/InitialsIcon';

import {ReactComponent as RemoveIcon} from '../../images/close_small.svg';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../reusable/PopUp';

const CreatePost = () => {
    let editor = useRef();
    const [postCId, setPostCId] = useState();
    const [postCommunity, setPostCommunity] = useState('');
    const [suggestedCommunities, setSuggestedCommunities] = useState([]);
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState([]);
    // const postBodyRef = useRef();

    const [isPostCommunitySelected, setIsPostCommunitySelected] = useState(false);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(true);

    const searchRef = useRef();

    let history = useHistory();

    useEffect(() => {
        console.log(isPostCommunitySelected);
    }, [isPostCommunitySelected]);

   useEffect(() => {
    initEditor();
   }, []);

   const initEditor = () => {
    editor.current = new EditorJs({
        holder: 'editorjs',
        stretched: false,
        placeholder: 'Click on + to create a new block',
        tools: {
            header: {
                class: Header,
                inlineToolbar: true,
                shortcut: 'CMD+SHIFT+H'
            },
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
        onChange:  () => {
            editor.current.save()
            .then(data => {
                setPostBody(data)
            })
            .catch(err => {
                let postBodyError = PopUp('Something went wrong', err);
                PopUpQueue(postBodyError);
            });
        }
    });
   }
   

    const containsSpecialChar = str => {
        const pattern = /\W/g;
        return pattern.test(str);
    }

    useEffect(() => {
        if(isPostCommunitySelected) return;

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
            setSuggestedCommunities(result.data.message);
        })
        .catch(err => {
            if(axios.isCancel(err)) return;
            let genericError = PopUp('Something went wrong', err);
            PopUpQueue(genericError);
        });

        return () => {
            cancelRequestToken();
        }

        // eslint-disable-next-line
    }, [postCommunity]);

    const handlePostTitle = e => {
        setPostTitle(e.target.value);
    }
    
    const setAsPostCommunity = (cId, cName) => {
        setPostCommunity('');
        setPostCId(null);
        console.log(cId);
        console.log(cName);
        console.log('helooooooo');
        setPostCId(cId);

        setPostCommunity(cName);
        setSuggestedCommunities([]);

        setIsPostCommunitySelected(true);
    }

    const handlePostCommunity = e => {
        const isInvalid = containsSpecialChar(e.target.value.substr(-1));
        
        if(isInvalid) {
            let invalidPostCommunityNameError = PopUp('Invalid type', 'Special characters are invalid');
            PopUpQueue(invalidPostCommunityNameError);
            return;
        }

        setPostCommunity(e.target.value);
    }

        const handleCreatePost = async (e) => {
            e.preventDefault();

        if(postTitle === '') {
            let postTitleError = PopUp('Something went wrong', 'Post title cannot be empty');
            PopUpQueue(postTitleError);
            return;
        } else if(postTitle.length > 100) {
            let postTitleError = PopUp('Something went wrong', 'Post title should not exceed 100 characters');
            PopUpQueue(postTitleError);
            return;
        } else if(!postCId) {
            let postTitleError = PopUp('Something went wrong', 'Please choose a valid community to post');
            PopUpQueue(postTitleError);
            return;
        }

        let tempPostInfo = {
            cId: postCId,
            cName: postCommunity,
            title: postTitle,
            body: postBody
        }
    
        const response = await axios.post('/create/post', tempPostInfo);
        if(response.data.error) {
            let genericError = PopUp('Something went wrong', response.data.error);
            PopUpQueue(genericError);
            return;
        }

        setPostBody(null);
        setPostTitle('');
        setPostCId(null);
        setPostCommunity('');
    
        history.push(`/p/${response.data.message}`);
    };

    const handleClearPostCommunity = () => {
        setPostCommunity('');
        setSuggestedCommunities([]);
        setIsPostCommunitySelected(false);
    }

    const handleSearchTextFocus = () => {
        setIsSuggestionsOpen(true);

        // searchRef.current.classList.add('search-input-focus');
    }

    const handleSearchTextBlur = () => {

        // searchRef.current.classList.remove('search-input-focus');
    }

    useEffect(() => {
        const checkIfClickedOutside = e => {
          if(isSuggestionsOpen && searchRef.current && !searchRef.current.contains(e.target)) {
            setIsSuggestionsOpen(true);
            return;
          }
        }
    
        if(!isSuggestionsOpen) {
            document.removeEventListener('mousedown', checkIfClickedOutside);
            console.log('e l removed');
        } else {
            document.addEventListener('mousedown', checkIfClickedOutside);
            console.log('e l attached');
        }

        return () => {
          document.removeEventListener('mousedown', checkIfClickedOutside);
        }
    }, [isSuggestionsOpen]);

    return(
        <div className = 'create-container'>
            {/* <Head /> */}

            <form onSubmit = {handleCreatePost} className = 'create create-post'>
                <div className = 'create-back'>
                    <BackButton />
                </div>

                <div className = 'create-title'>Create a post</div>

                <div className = 'create-header create-header-post'>
                    <input type = 'text' onChange = {handlePostTitle} placeholder = 'Post title' value = {postTitle} className = 'create-input' />

                    <div className = 'search' ref = {searchRef}>
                        {
                            isPostCommunitySelected ?
                            <div onClick = {handleClearPostCommunity} className = 'create-post-selected-community'>
                                <span>{postCommunity}</span>
                                <RemoveIcon />
                            </div>:
                            <input type = 'text' onChange = {handlePostCommunity} placeholder = 'Search a community to post in' value = {postCommunity} className = 'search-input' onFocus = {handleSearchTextFocus} onBlur = {handleSearchTextBlur} />
                        }

                        {
                            isSuggestionsOpen && suggestedCommunities.length > 0 &&
                            <div className = 'search-suggestions'>
                                {
                                    suggestedCommunities.map(sc => {
                                        let isSetAsPostCommunity = (sc._id === postCId);
                                        
                                        if(isSetAsPostCommunity) return null;
                                        
                                        return <div key = {sc._id} onClick = {() => setAsPostCommunity(sc._id, sc.cName)} className = 'search-suggestion-item'>
                                            {
                                                sc.cThumbnail ?
                                                <GeneralProfileIcon imageSource = 'communityThumbnails' imageID = {sc.cThumbnail} />:
                                                <InitialsIcon initial = {sc.cName[0]} />
                                            }
                                            <div className = 'search-suggestion-text'>{sc.cName}</div>
                                        </div>
                                    })
                                }
                            </div>
                        }
                    </div>
                </div>

                <div id = 'editorjs'></div>

                <div className = 'create-submit'>
                    <input type = 'submit' value = 'Create' className = 'create-input create-submit-button' />
                </div>
            </form>

            <Popup />
        </div>
    );
};

export default CreatePost;