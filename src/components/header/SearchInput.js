import '../../styles/header/SearchInput.css';

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

import GeneralProfileIcon from '../reusable/GeneralProfileIcon';
import InitialsIcon from '../reusable/InitialsIcon';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../reusable/PopUp';


const SearchInput = () => {
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
            setUserSuggestions(res.data.message);
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

        searchRef.current.classList.add('search-input-focus');
    }

    const handleSearchTextBlur = () => {

        searchRef.current.classList.remove('search-input-focus');
    }

    useEffect(() => {
        const checkIfClickedOutside = e => {
          if(isSuggestionsOpen && searchRef.current && !searchRef.current.contains(e.target)) {
            setIsSuggestionsOpen(false);
          }
        }
    
        document.addEventListener('mousedown', checkIfClickedOutside);
    
        return () => {
          document.removeEventListener('mousedown', checkIfClickedOutside);
        }
      }, [isSuggestionsOpen]);


    return <div className = 'search' ref = {searchRef}>
    <input type = 'search' placeholder = 'Search for communities and users' className = 'search-input' onChange = {handleSearchTextChange} value = {searchText} onFocus={handleSearchTextFocus} onBlur = {handleSearchTextBlur} />

    {
        searchText && isSuggestionsOpen &&
        <div className = 'search-suggestions'>
            {
                communitySuggestions && communitySuggestions.length > 0 &&
                <>
                    <div className = 'search-suggestion-header'>communities</div>
                    {
                        communitySuggestions.map(community => (
                            <div key = {community.cName} onClick={handleSuggestionClicked} className = 'search-suggestion-item'>
                                <Link to={'/c/' + community.cName} className = 'search-suggestion-item-link'>
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
                userSuggestions && userSuggestions.length > 0 &&
                <>
                    <div className = 'search-suggestion-header'>users</div>
                    {
                        userSuggestions.map(user => (
                            <div key = {user.username} onClick={handleSuggestionClicked} className = 'search-suggestion-item'>
                                <Link to={'/u/' + user.username} className = 'search-suggestion-item-link'>
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

        <Popup />
</div>
};

export default SearchInput;