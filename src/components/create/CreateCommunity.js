import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';

import Header from '../Header';

const CreatCommunity = () => {
    const [community, setCommunity] = useState({
        //fetch the user(moderator) id i.e. uId from session/cookies, this is temporarily hardcoded.
        // uId: "615d811c287262fe7b459383",
        cName: '',
        desc: '',
        relatedCommunities: []
    });
    const [currentRelatedCommunity, setCurrentRelatedCommunity] = useState('');
    const [suggestedCommunities, setSuggestedCommunities] = useState([]);

    const currentRelatedCommunityRef = useRef();

    const containsSpecialChar = str => {
        const pattern = /\W/g;
        return pattern.test(str);
    }

    const handleCommunityName = e => {
        const isInvalid = containsSpecialChar(e.target.value.substr(-1));
        
        if(isInvalid) return;

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
        
        if(isInvalid) return;
        
        setCurrentRelatedCommunity(e.target.value);
    };

    useEffect(() => {
        let cancelRequestToken;
        if(currentRelatedCommunity === '') {
            setSuggestedCommunities([]);
            return;
        }

        axios.post('/search/community', {text: currentRelatedCommunity}, {
            cancelToken: new axios.CancelToken(c => cancelRequestToken = c)
        })
        .then(result => {
            console.log(result);
            setSuggestedCommunities(result.data);
        })
        .catch(err => {
            if(axios.isCancel(err)) return;
            console.log(err);
        })

        return () => {
            cancelRequestToken();
        }
        
        // const getSuggestions = async () => {
        //     let cancelRequestToken;
        //     if(currentRelatedCommunity === '') {
        //         setSuggestedCommunities([]);
        //         return;
        //     }

        //     const result = await axios.post('/search/community', {text: currentRelatedCommunity}, {
        //         cancelToken: new axios.CancelToken(c => cancelRequestToken = c)
        //     });  
        //     console.log(result);
        //     setSuggestedCommunities(result.data);

        //     return () => {
        //         cancelRequestToken();
        //     }
        // }
        // getSuggestions();
             
    }, [currentRelatedCommunity]);


    const addAsRelatedCommunity = e => {
        let newSuggestedCommunities = [];
        setCommunity(previousState => {
            return {
                ...previousState,
                relatedCommunities: [...previousState.relatedCommunities, {
                    id: e.target.dataset.c_id,
                    name: e.target.dataset.c_name
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
            if(relatedCommunity.id !== e.target.dataset.c_id) {
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
            console.log('Community name can\'t be empty');
            return;
        }
        
        const res = await axios.post('/create/community', community);
        console.log(res.data);

        setCommunity({
            cName: '',
            desc: '',
            relatedCommunities: [] 
        });
        setCurrentRelatedCommunity('');
        setSuggestedCommunities([]);
    };

    return(
        <>
            <Header />
            <form onSubmit = {handleCreateCommunity}>
                <input type = 'text' onChange = {handleCommunityName} value = {community.cName} placeholder = 'name' />

                <textarea onChange = {handleCommunityDesc} value = {community.desc} placeholder = 'write a few words about the community' style={{resize: "none"}}></textarea>

                <input type = 'text' onChange = {handleRelatedCommunities} value = {currentRelatedCommunity} placeholder = 'related community' ref = {currentRelatedCommunityRef} />
                    
                {
                    suggestedCommunities !== [] &&
                    <ul>
                        {
                            suggestedCommunities.map(sc => {
                                let isARelatedCommunity = community.relatedCommunities.some(rc => (
                                    rc.id === sc._id
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
                                return (
                                    <div key = {relatedCommunity.id} data-c_id = {relatedCommunity.id} className = 'related_community' onClick = {removeFromRelatedCommunities}>{relatedCommunity.name}</div>
                                )
                            })
                        }
                    </div>
                }
            </form>
        </>
    );
};

export default CreatCommunity;