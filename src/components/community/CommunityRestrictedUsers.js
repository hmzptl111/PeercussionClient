import React, { useContext, useEffect, useRef, useState } from 'react';

import { UserAuthStatusContext } from '../../contexts/UserAuthStatus';

import GeneralProfileIcon from '../reusable/GeneralProfileIcon';
import InitialsIcon from '../reusable/InitialsIcon';

import axios from 'axios';

import Popup from 'react-popup';
import { PopUp, PopUpQueue } from '../reusable/PopUp';

const CommunityRestrictedUsers = ({cName, isModerator}) => {
    const {user} = useContext(UserAuthStatusContext);

    const [restrictedUsers, setRestrictedUsers] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [userSuggestions, setUserSuggestions] = useState([]);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(true);

    const searchRef = useRef();

    const handleSearchTextChange = e => {
        setSearchText(e.target.value);
    }
    
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
                    username: user.username
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

    return(
        <>
            {
                isModerator &&
                <div ref = {searchRef}>
                    <input type = 'text' placeholder = 'Search user to restrict' onChange = {handleSearchTextChange} value = {searchText} onFocus={handleSearchTextFocus} />
        
                    {
                        searchText && isSuggestionsOpen &&
                        <div>           
                            {
                                userSuggestions && userSuggestions.length > 0 &&
                                <>
                                    {
                                        userSuggestions.map(user => (
                                            <div key = {user.username} onClick={handleSuggestionClicked}>
                                                <div style = {{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                                                    <div style = {{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                        {
                                                            user.profilePicture ?
                                                            <GeneralProfileIcon imageSource = 'profilePictures' imageID = {user.profilePicture} />:
                                                            <InitialsIcon initial = {user.username[0]} />
                                                        }
                                                        <div>{user.username}</div>
                                                    </div>
                                                    <button onClick = {() => handleUserRestrict(user)}>{!user.isRestricted ? 'Restrict' : 'Unrestrict'}</button>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </>
                            }
                        </div>
                    }
                </div>
            }
            {
                restrictedUsers.length > 0 ?
                restrictedUsers.map(u => (
                    <div key = {u._id}>
                        {u.username}
                        {
                            isModerator &&
                            <button onClick = {() => handleUserUnrestrict(u)}>Unrestrict</button>
                        }
                    </div>
                )):
                'No users restricted'
            }

            <Popup />
        </>
    );
};

export default CommunityRestrictedUsers;