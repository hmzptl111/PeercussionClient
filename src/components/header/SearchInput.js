import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import '../../styles/header/SearchInput.css';

import { UserAuthStatusContext } from '../../contexts/UserAuthStatus';

import GeneralProfileIcon from '../reusable/GeneralProfileIcon';
import InitialsIcon from '../reusable/InitialsIcon';

import axios from 'axios';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../reusable/PopUp';

const SearchInput = () => {
    const {user} = useContext(UserAuthStatusContext);

    const [searchText, setSearchText] = useState('');
    const [communitySuggestions, setCommunitySuggestions] = useState([]);
    const [userSuggestions, setUserSuggestions] = useState([]);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(true);

    const searchRef = useRef();

    
    const handleSearchTextChange = e => {
        setSearchText(e.target.value);
    }
    
    useEffect(() => {
        if(searchText === '') return;

        let cancelRequestToken;
        
        axios.post('/search/community', {
            text: searchText
        }, {
            cancelToken: new axios.CancelToken(c => cancelRequestToken = c)
        }).then(res => {
            setCommunitySuggestions(res.data.message);
        }).catch(err => {
            if(axios.isCancel(err)) return;
            let errorPopup = PopUp('Something went wrong', err);
            PopUpQueue(errorPopup);
        })   
        
        axios.post('/search/user', {
            text: searchText
        }, {
            cancelToken: new axios.CancelToken(c => cancelRequestToken = c)
        }).then(res => {
            let users;
            if(user) {
                users = res.data.message.filter(u => u._id !== user.uId);
            } else {
                users = res.data.message;
            }
            setUserSuggestions(users);
        }).catch(err => {
            if(axios.isCancel(err)) return;
            let errorPopup = PopUp('Something went wrong', err);
            PopUpQueue(errorPopup);
        }) 

        return () => cancelRequestToken();
        //eslint-disable-next-line
    }, [searchText]);

    const handleSuggestionClicked = () => {
        setIsSuggestionsOpen(false);

        setSearchText('');
    }

    const handleSearchTextFocus = () => {
        setIsSuggestionsOpen(true);
    }

    useEffect(() => {
        const checkIfClickedOutside = e => {
          if (isSuggestionsOpen && searchRef.current && !searchRef.current.contains(e.target)) {
            setIsSuggestionsOpen(false);
          }
        }
    
        document.addEventListener('mousedown', checkIfClickedOutside);
    
        return () => {
          document.removeEventListener('mousedown', checkIfClickedOutside);
        }
      }, [isSuggestionsOpen]);


    return(
        <>
            <div className = 'search' ref = {searchRef}>
            <input type = 'text' placeholder = 'Search for communities and users' className = 'search-input' onChange = {handleSearchTextChange} value = {searchText} onFocus={handleSearchTextFocus} />

            {
                searchText && isSuggestionsOpen &&
                <div className = 'search-suggestions'>
                    {
                        communitySuggestions.length > 0 &&
                        <>
                            <div style = {{fontSize: '0.8em'}}>communities</div>
                            {
                                communitySuggestions.map(community => (
                                    <div key = {community.cName} onClick={handleSuggestionClicked}>
                                        <Link to={'/c/' + community.cName} className = 'search-suggestion-community-link' style = {{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                                        {
                                            community.cThumbnail ?
                                            <GeneralProfileIcon imageSource = 'communityThumbnails' imageID = {community.cThumbnail} />:
                                            <InitialsIcon initial = {community.cName[0]} />
                                        }
                                            <div className = 'search-suggestion-text'>{community.cName}</div>
                                        </Link>
                                    </div>
                                ))
                            }
                        </>
                    }             
                    {
                        userSuggestions.length > 0 &&
                        <>
                            <div style = {{fontSize: '0.8em'}}>users</div>
                            {
                                userSuggestions.map(user => (
                                    <div key = {user.username} onClick={handleSuggestionClicked}>
                                        <Link to={'/u/' + user.username} className = 'search-suggestion-community-link' style = {{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                                            {
                                                user.profilePicture ?
                                                <GeneralProfileIcon imageSource = 'profilePictures' imageID = {user.profilePicture} />:
                                                <InitialsIcon initial = {user.username[0]} />
                                            }
                                            <div className = 'search-suggestion-text'>{user.username}</div>
                                        </Link>
                                    </div>
                                ))
                            }
                        </>
                    }
                </div>
            }
        </div>

        <Popup />
        </>
    );
};

export default SearchInput;