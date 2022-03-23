import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

import GetCommunities from '../reusable/GetCommunities';
import GeneralProfileIcon from '../reusable/GeneralProfileIcon';
import InitialsIcon from '../reusable/InitialsIcon';

import {ReactComponent as EditIcon} from '../../images/edit.svg';
import {ReactComponent as PlusIcon} from '../../images/plus.svg';

import { PopUp, PopUpQueue } from '../reusable/PopUp';


const CommunityRelatedCommunities = ({cId, cName, relatedCommunities, isOwner, setCommunity}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedRelatedCommunities, setUpdatedRelatedCommunities] = useState(relatedCommunities);
    const [suggestedCommunities, setSuggestedCommunities] = useState([]);
    const [currentRelatedCommunity, setCurrentRelatedCommunity] = useState('');
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(true);

    const searchRef = useRef();
    const editRef = useRef();
    const currentRelatedCommunityRef = useRef();

    useEffect(() => {
        setCommunity(previousState => {
            return {
                ...previousState,
                relatedCommunities: updatedRelatedCommunities
            }
        });
        //eslint-disable-next-line
    }, [updatedRelatedCommunities]);

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
            // filtering current community from suggestions
            const tempSuggestions = result.data.message.filter(c => c._id !== cId);

            // filtering existing related communities from suggestions
            const suggestions = updatedRelatedCommunities.length > 0 ? tempSuggestions.filter(c => {
                return updatedRelatedCommunities.some(urc => urc !== c._id);
            }):
            tempSuggestions;

            setSuggestedCommunities(suggestions);
        })
        .catch(err => {
            if(axios.isCancel(err)) return;

            let genericError = PopUp('Something went wrong', err);
            PopUpQueue(genericError);
        });

        return () => {
            cancelRequestToken();
        }
        //eslint-disable-next-line
    }, [currentRelatedCommunity]);

    const containsSpecialChar = str => {
        const pattern = /\W/g;
        return pattern.test(str);
    }

    const handleSearchTextFocus = () => {
        setIsSuggestionsOpen(true);
    }

    const handleRelatedCommunities = e => {
        const isInvalid = containsSpecialChar(e.target.value.substr(-1));
        
        if(isInvalid) {
            let invalidRelatedCommunityNameError = PopUp('Invalid type', 'Special characters are invalid');
            PopUpQueue(invalidRelatedCommunityNameError);
            return;
        }
        
        setCurrentRelatedCommunity(e.target.value);
    };

    const addAsRelatedCommunity = async (relatedCommunityID, relatedCommunityName) => {
        setCurrentRelatedCommunity('');

        setUpdatedRelatedCommunities(previousState => {
            return [...previousState, relatedCommunityID];
        });

        let newSuggestedCommunities = suggestedCommunities.filter(s => s._id !== relatedCommunityID);

        setSuggestedCommunities(newSuggestedCommunities);

        const payload = {
            cName: cName,
            body: relatedCommunityID,
            field: 'relatedCommunities',
            schema: 'community'
        }

        const response = await axios.post('/update', payload);
        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }
    };

    const handleEdit = () => {
        setIsEditing(previousState => !previousState);
    }

    return <div className = 'tab-content-container'>
    {
        isOwner === 'yes' && 
        <div ref = {editRef} className = 'edit' onClick = {handleEdit}>
            <EditIcon />
        </div>
    }
    
    {
        isEditing &&
        <div className = 'search' ref = {searchRef}>
            <input type = 'text' onChange = {handleRelatedCommunities} value = {currentRelatedCommunity} placeholder = 'Search to add related communities' ref = {currentRelatedCommunityRef} className = 'search-input search-input-small' onFocus = {handleSearchTextFocus} />

            {
                isSuggestionsOpen && suggestedCommunities.length > 0 &&
                <div className = 'list-container'>
                    {
                        suggestedCommunities.map(sc => {
                            return <div key = {sc._id} className = 'list'>
                                <Link to = {`/c/${sc.cName}`} className = 'list-info'>
                                    {
                                        sc.cThumbnail ?
                                        <GeneralProfileIcon imageSource = 'communityThumbnails' imageID = {sc.cThumbnail} />:
                                        <InitialsIcon initial = {sc.cName[0]} />
                                    }
                                    <div className = 'list-info-text'>{sc.cName}</div>
                                </Link>

                                {
                                    <div className = 'list-button' onClick = {() => addAsRelatedCommunity(sc._id, sc.cName)}>
                                        Add
                                        <PlusIcon />
                                    </div>
                                }
                            </div>
                        })
                    }
                </div>
            }
        </div>
    }

    {
        updatedRelatedCommunities &&
        <GetCommunities cName = {cName} type = 'related' isEditing = {isEditing} updatedRelatedCommunities = {updatedRelatedCommunities} setUpdatedRelatedCommunities = {setUpdatedRelatedCommunities} />
    }
</div>
}

export default CommunityRelatedCommunities;