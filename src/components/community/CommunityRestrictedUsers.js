import '../../styles/reusable/GetCommunities.css';
import '../../styles/community/CommunityRestrictedUsers.css';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

import { UserAuthStatusContext } from '../../contexts/UserAuthStatus';

import GeneralProfileIcon from '../reusable/GeneralProfileIcon';
import InitialsIcon from '../reusable/InitialsIcon';
import Empty from '../reusable/Empty';

import {ReactComponent as RestrictIcon} from '../../images/restricted.svg';
import {ReactComponent as UnrestrictIcon} from '../../images/unrestricted.svg';
import {ReactComponent as EditIcon} from '../../images/edit.svg';

import Popup from 'react-popup';
import { PopUp, PopUpQueue } from '../reusable/PopUp';


const CommunityRestrictedUsers = ({cName, isOwner, setCommunity}) => {
    const [restrictedUsers, setRestrictedUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [userSuggestions, setUserSuggestions] = useState([]);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    const {user} = useContext(UserAuthStatusContext);

    const searchRef = useRef();

    const handleSearchTextChange = e => {
        setSearchText(e.target.value);
    }

    useEffect(() => {
        setCommunity(previousState => {
            return {
                ...previousState,
                restrictedUsers: restrictedUsers
            }
        });
        //eslint-disable-next-line
    }, [restrictedUsers]);
    
    useEffect(() => {
        const getRestrictedUsers = async () => {
            const response = await axios.post('/getRestrictedUsers', {cName: cName});
            
            if(response.data.error) {
                let genericError = PopUp('Something went wrong', response.data.error);
                PopUpQueue(genericError);
                return;
            }

            setRestrictedUsers(response.data.message);
        }

        getRestrictedUsers();
    }, [cName]);

    useEffect(() => {
        if(searchText === '') return;

        let cancelRequestToken;  
        
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

            for(let i = 0; i < users.length; i++) {
                users[i].isRestricted = false;
                for(let j = 0; j < restrictedUsers.length; j++) {
                    if(users[i]._id === restrictedUsers[j]._id) {
                        users[i].isRestricted = true;
                    }
                }
            }

            setUserSuggestions(users);
        }).catch(err => {
            if(axios.isCancel(err)) return;

            let genericError = PopUp('Something went wrong', err);
            PopUpQueue(genericError);
        });

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

      const handleUserRestrict = async (user) => {
        const payload = {
            restrictUId: user._id,
            cName: cName
        }

        if(user.isRestricted) {
            const response = await axios.post('/restrictUser/unrestrict', payload);
            
            if(response.data.error) {
                let errorPopup = PopUp('Something went wrong', response.data.error);
                PopUpQueue(errorPopup);
                return;
            }

            setRestrictedUsers(previousState => {
                let updatedRestrictedUsers = previousState.filter(u => u._id !== user._id);
                return updatedRestrictedUsers;
            });
        } else {
            const response = await axios.post('/restrictUser/restrict', payload);
            
            if(response.data.error) {
                let errorPopup = PopUp('Something went wrong', response.data.error);
                PopUpQueue(errorPopup);
                return;
            }

            setRestrictedUsers(previousState => {
                const newRestrictedUser = {
                    _id: user._id,
                    username: user.username,
                    profilePicture: user.profilePicture
                }
                let updatedRestrictedUsers = [...previousState, newRestrictedUser];
                return updatedRestrictedUsers;
            });
        }
      }

      const handleUserUnrestrict = async (user) => {
        const payload = {
            restrictUId: user._id,
            cName: cName
        }

        const response = await axios.post('/restrictUser/unrestrict', payload);

        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        setRestrictedUsers(previousState => {
            let updatedRestrictedUsers = previousState.filter(u => u._id !== user._id);
            return updatedRestrictedUsers;
        });
      }

    const handleEdit = () => {
        setIsEditing(previousState => !previousState);
    }

    return <div className = 'tab-content-container'>
    {
        isOwner === 'yes' &&
        <div className = 'edit' onClick = {handleEdit}>
            <EditIcon />
        </div>
    }

    {
        isEditing &&
        <div ref = {searchRef} className = 'search'>
            <input type = 'text' placeholder = 'Search user to restrict' onChange = {handleSearchTextChange} value = {searchText} onFocus={handleSearchTextFocus} className = 'search-input search-input-small' />
            
            {
                searchText && isSuggestionsOpen &&
                <div>      
                    {
                        userSuggestions && userSuggestions.length > 0 &&
                        <div className = 'list-container'>
                            {
                                userSuggestions.map(user => (
                                    !user.isRestricted &&
                                        <div className = 'list' key = {user.username} onClick={handleSuggestionClicked}>
                                            <Link to = {`/u/${user.username}`} className = 'list-info'>
                                                {
                                                    user.profilePicture ?
                                                    <GeneralProfileIcon imageSource = 'profilePictures' imageID = {user.profilePicture} />:
                                                    <InitialsIcon initial = {user.username[0]} />
                                                }
                                                <span className = 'list-info-text'>{user.username}</span>
                                            </Link>

                                            {
                                                <div className = 'list-button' onClick = {() => handleUserRestrict(user)}>
                                                    Restrict
                                                    <RestrictIcon />
                                                </div>
                                            }
                                        </div>
                                ))
                            }
                        </div>
                    }
                </div>
            }
        </div>
    }

    {
        restrictedUsers.length > 0 ?
        <div className = 'list-container'>
            {
                restrictedUsers.map(u => (
                    <div className = 'list' key = {u._id}>
                        <Link to = {`/u/${u.username}`} className = 'list-info'>
                            {
                                u.profilePicture ?
                                <GeneralProfileIcon imageSource = 'profilePictures' imageID = {u.profilePicture} />:
                                <InitialsIcon initial = {u.username[0]} />
                            }
                            <span className = 'list-info-text'>{u.username}</span>
                        </Link>
                            
                        {
                            isOwner &&
                            <div onClick = {() => handleUserUnrestrict(u)} className = 'list-button'>
                                Unrestrict
                                <UnrestrictIcon />
                            </div>
                        }
                    </div>
                ))
            }
        </div>:
        <Empty text = 'Arms, wide open!' caption = 'No one is restricted from this community' GIF = 'https://c.tenor.com/bGgv8ew9uNAAAAAC/mr-bean.gif' />
    }

    <Popup />
</div>
};

export default CommunityRestrictedUsers;