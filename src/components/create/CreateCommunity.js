import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';

import { useHistory } from 'react-router-dom';

import Header from '../Header';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../reusable/PopUp';

const CreatCommunity = () => {
    const [community, setCommunity] = useState({
        cName: '',
        desc: '',
        relatedCommunities: []
    });
    const [currentRelatedCommunity, setCurrentRelatedCommunity] = useState('');
    const [suggestedCommunities, setSuggestedCommunities] = useState([]);

    const currentRelatedCommunityRef = useRef();

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
            setSuggestedCommunities(result.data);
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


    const addAsRelatedCommunity = e => {
        setCurrentRelatedCommunity('');

        let newSuggestedCommunities = [];
        setCommunity(previousState => {
            return {
                ...previousState,
                relatedCommunities: [...previousState.relatedCommunities, {
                    cId: e.target.dataset.c_id,
                    cName: e.target.dataset.c_name
                }]
            }
        });

        suggestedCommunities.forEach(suggestedCommunity => {
            if(suggestedCommunity._id !== e.target.id) {
                newSuggestedCommunities = [...newSuggestedCommunities, suggestedCommunity];
            }
        });

        setSuggestedCommunities(newSuggestedCommunities);

        currentRelatedCommunityRef.current.focus();
    };

    const removeFromRelatedCommunities = e => {
        let tempRelatedCommunities = [];
        community.relatedCommunities.forEach(relatedCommunity => {
            if(relatedCommunity.cId !== e.target.dataset.c_id) {
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
        }

        let newRelatedCommunities = [];
        for(let i = 0; i < community.relatedCommunities.length; i++) {
            newRelatedCommunities.push(community.relatedCommunities[i].cId);
        }

        let newCommunity = community;
        newCommunity.relatedCommunities = newRelatedCommunities;

        const res = await axios.post('/create/community', newCommunity);
        if(res.data.error) {
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

    return(
        <>
            <Header />
            <form onSubmit = {handleCreateCommunity} style = {{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <input type = 'text' onChange = {handleCommunityName} value = {community.cName} placeholder = 'name' />

                <textarea onChange = {handleCommunityDesc} value = {community.desc} placeholder = 'write a few words about the community' style={{resize: "none"}}></textarea>

                <input type = 'text' onChange = {handleRelatedCommunities} value = {currentRelatedCommunity} placeholder = 'related community' ref = {currentRelatedCommunityRef} />
                    
                {
                    suggestedCommunities !== [] &&
                    <ul>
                        {
                            suggestedCommunities.map(sc => {
                                let isARelatedCommunity = community.relatedCommunities.some(rc => (
                                    rc.cId === sc._id
                                ));
                                
                                if(isARelatedCommunity) return null;
                                
                                return <li key = {sc._id} data-c_id = {sc._id} data-c_name = {sc.cName} onClick = {addAsRelatedCommunity}>{sc.cName}</li>
                            })
                        }
                    </ul>
                }

                <input type = 'submit' value = 'Create' />
        
                {
                    community.relatedCommunities.length > 0 &&
                    <div className = 'related_communities'>
                        {
                            community.relatedCommunities.map(relatedCommunity => {
                                return <div key = {relatedCommunity.cId} data-c_id = {relatedCommunity.cId} className = 'related_community' onClick = {removeFromRelatedCommunities}>{relatedCommunity.cName}</div>
                            })
                        }
                    </div>
                }
            </form>

            <Popup />
        </>
    );
};

export default CreatCommunity;