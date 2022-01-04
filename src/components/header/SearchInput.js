import React, { useEffect, useRef, useState } from 'react';
import '../../styles/header/SearchInput.css';

import axios from 'axios';
import { Link } from 'react-router-dom';

const SearchInput = () => {
    const [searchText, setSearchText] = useState('');
    const [communitySuggestions, setCommunitySuggestions] = useState([]);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(true);

    const searchRef = useRef();

    
    const handleSearchTextChange = e => {
        setSearchText(e.target.value);
    }
    
    useEffect(() => {
        if(!searchText) return;

        let cancelRequestToken;
        
        axios.post('/search/community', {
            text: searchText
        }, {
            cancelToken: new axios.CancelToken(c => cancelRequestToken = c)
        }).then(res => {
            setCommunitySuggestions(res.data);
        }).catch(err => {
            if(axios.isCancel(err)) return;
            console.log(err);
        })        

        return () => cancelRequestToken();
    }, [searchText]);

    const handleCommunitySuggestionClicked = () => {
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
        <div className = 'search' ref = {searchRef}>
            <input type = 'text' placeholder = 'Search for communities and users' className = 'search-input' onChange = {handleSearchTextChange} value = {searchText} onFocus={handleSearchTextFocus} />

            {
                searchText && isSuggestionsOpen &&
                <div className = 'search-suggestions'>
                    {
                        communitySuggestions &&
                        communitySuggestions.map(community => (
                            <Link to={'/c/' + community.cName} key = {community.cName} onClick={handleCommunitySuggestionClicked} className = 'search-suggestion-community-link'>
                                <div className = 'search-suggestion-community'>{community.cName}</div>
                            </Link>
                        ))
                    }
                </div>
            }
        </div>
    );
};

export default SearchInput;