import '../../styles/create/Create.css';

import React, {useEffect, useRef, useState} from 'react';
import { useHistory } from 'react-router-dom';

import axios from 'axios';

import GeneralProfileIcon from '../reusable/GeneralProfileIcon';
import InitialsIcon from '../reusable/InitialsIcon';

import {ReactComponent as RemoveIcon} from '../../images/close_small.svg';

import {PopUp, PopUpQueue} from '../reusable/PopUp';

const CreatCommunity = () => {
    const [community, setCommunity] = useState({
        cName: '',
        desc: '',
        relatedCommunities: []
    });
    const [currentRelatedCommunity, setCurrentRelatedCommunity] = useState('');
    const [suggestedCommunities, setSuggestedCommunities] = useState([]);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(true);

    const currentRelatedCommunityRef = useRef();
    const searchRef = useRef();

    let history = useHistory();

    const containsSpecialChar = str => {
        const pattern = /\W/g;
        return pattern.test(str);
    }

    const handleCommunityName = e => {
        const isInvalid = containsSpecialChar(e.target.value.substr(-1));
        
        if(isInvalid) {
            let invalidCommunityNameError = PopUp('Invalid type', 'Special characters are invalid');
            PopUpQueue(invalidCommunityNameError);
            return;
        }

        setCommunity(previousState => {
            return {
                ...previousState,
                cName: e.target.value
            }
        });
    };

    const handleCommunityDesc = e => {
        setCommunity(previousState => {
            return {
                ...previousState,
                desc: e.target.value
            }
        });
    };

    const handleRelatedCommunities = e => {
        const isInvalid = containsSpecialChar(e.target.value.substr(-1));
        
        if(isInvalid) {
            let invalidRelatedCommunityNameError = PopUp('Invalid type', 'Special characters are invalid');
            PopUpQueue(invalidRelatedCommunityNameError);
            return;
        }
        
        setCurrentRelatedCommunity(e.target.value);
    };

    useEffect(() => {
        if(currentRelatedCommunity === '') {
            setSuggestedCommunities([]);
            return;
        }

        let cancelRequestToken;

        axios.post('/search/community', {text: currentRelatedCommunity}, {
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
        })

        return () => {
            cancelRequestToken();
        }
             
    }, [currentRelatedCommunity]);


    const addAsRelatedCommunity = (relatedCommunityID, relatedCommunityName) => {
        setCurrentRelatedCommunity('');

        let newSuggestedCommunities = [];
        setCommunity(previousState => {
            return {
                ...previousState,
                relatedCommunities: [...previousState.relatedCommunities, {
                    cId: relatedCommunityID,
                    cName: relatedCommunityName
                }]
            }
        });

        suggestedCommunities.forEach(suggestedCommunity => {
            if(suggestedCommunity._id !== relatedCommunityID) {
                newSuggestedCommunities = [...newSuggestedCommunities, suggestedCommunity];
            }
        });

        setSuggestedCommunities(newSuggestedCommunities);

        currentRelatedCommunityRef.current.focus();
    };

    const removeFromRelatedCommunities = (relatedCommunityCID) => {
        console.log('remove');
        let tempRelatedCommunities = [];
        community.relatedCommunities.forEach(relatedCommunity => {
            if(relatedCommunity.cId !== relatedCommunityCID) {
                tempRelatedCommunities = [...tempRelatedCommunities, relatedCommunity];
            }
        });

        setCommunity(previousState => {
            return {
                ...previousState,
                relatedCommunities: tempRelatedCommunities
            }
        });
    }

    const handleCreateCommunity = async (e) => {
        e.preventDefault();

        if(community.cName === '') {
            let communityNameError = PopUp('Something went wrong', 'Community name cannot be empty');
            PopUpQueue(communityNameError);
            return;
        } else if (community.desc.length <= 0 || community.desc.length > 255) {
            let communityNameError = PopUp('Something went wrong', 'Community name cannot be empty and must not exceed 255 characters');
            PopUpQueue(communityNameError);
            return;
        }

        let newRelatedCommunities = [];
        for(let i = 0; i < community.relatedCommunities.length; i++) {
            newRelatedCommunities.push(community.relatedCommunities[i].cId);
        }

        let newCommunity = community;
        newCommunity.relatedCommunities = newRelatedCommunities;

        const res = await axios.post('/create/community', newCommunity);
        if(res.data.error) {
            console.log(res.data);
            let genericError = PopUp('Something went wrong', res.data.error);
            PopUpQueue(genericError);
            return;
        }

        setCommunity({
            cName: '',
            desc: '',
            relatedCommunities: [] 
        });
        setCurrentRelatedCommunity('');
        setSuggestedCommunities([]);

        history.push(`/c/${res.data.message}`);
    };

    const handleSearchTextFocus = () => {
        setIsSuggestionsOpen(true);

        // searchRef.current.classList.add('search-input-focus');
    }

    const handleSearchTextBlur = () => {

        // searchRef.current.classList.remove('search-input-focus');
    }

    useEffect(() => {
        const checkIfClickedOutside = e => {
            console.log(e.target);
          if(isSuggestionsOpen && searchRef.current && !searchRef.current.contains(e.target)) {
            setIsSuggestionsOpen(false);
            console.log('closed');
            return;
          }
          console.log('clicked inside');
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
            {/* <Header /> */}

            <form onSubmit = {handleCreateCommunity} className = 'create'>

                <div className = 'create-title'>Create a community</div>
                
                <div className = 'create-header create-header-community'>
                    <input type = 'text' onChange = {handleCommunityName} value = {community.cName} placeholder = 'Community name' className = 'create-input' />

                    <div className = 'search' ref = {searchRef}>
                        <input type = 'text' onChange = {handleRelatedCommunities} value = {currentRelatedCommunity} placeholder = 'Search to add related communities' ref = {currentRelatedCommunityRef} className = 'search-input' onFocus = {handleSearchTextFocus} onBlur = {handleSearchTextBlur} />

                        {
                            isSuggestionsOpen && suggestedCommunities.length > 0 &&
                            <div className = 'search-suggestions'>
                                {
                                    suggestedCommunities.map(sc => {
                                        let isARelatedCommunity = community.relatedCommunities.some(rc => (
                                            rc.cId === sc._id
                                        ));
                                        
                                        if(isARelatedCommunity) return null;
                                        
                                        return <div key = {sc._id} onClick = {() => addAsRelatedCommunity(sc._id, sc.cName)} className = 'search-suggestion-item'>
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


                <textarea onChange = {handleCommunityDesc} value = {community.desc} placeholder = 'About community' className = 'create-input create-description'></textarea>

                <div className = 'create-submit'>
                    <input type = 'submit' value = 'Create' className = 'create-input create-submit-button' />
                </div>
            </form>

            {
                community.relatedCommunities.length > 0 &&
                <div className = 'related-communities-list'>
                    {
                        community.relatedCommunities.map(relatedCommunity => {
                            return <div key = {relatedCommunity.cId} className = 'related-community' onClick = {() => removeFromRelatedCommunities(relatedCommunity.cId)}>
                                <span className = 'related-community-text'>{relatedCommunity.cName}</span>
                                <RemoveIcon />
                            </div>
                        })
                    }
                </div>
            }
        </div>
    );
};

export default CreatCommunity;