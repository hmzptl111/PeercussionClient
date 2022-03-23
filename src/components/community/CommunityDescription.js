import { useEffect, useRef, useState } from 'react';
import '../../styles/community/CommunityDescription.css';

import axios from 'axios';

import Empty from '../reusable/Empty';

import {ReactComponent as EditIcon} from '../../images/edit.svg';

import { PopUp, PopUpQueue } from '../reusable/PopUp';

const CommunityDescription = ({cName, desc, isOwner, setCommunity}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedDesc, setUpdatedDesc] = useState(desc);
    
    const descRef = useRef();

    useEffect(() => {
        if(isEditing) {
            descRef.current.contentEditable = true;
            descRef.current.focus();
            return;
        }
        
        descRef.current.contentEditable = false;
        descRef.current.blur();
    }, [isEditing]);

    const handleChange = e => {
        setUpdatedDesc(e.target.innerText);
    }

    const handleEdit = () => {
        setIsEditing(previousState => !previousState);
    }

    const handleUpdate = async () => {
        const payload = {
            cName: cName,
            body: updatedDesc,
            field: 'desc',
            schema: 'community'
        }

        const response = await axios.post('/update', payload);
        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        setIsEditing(false);

        setCommunity(previousState => {
            return {
                ...previousState,
                desc: updatedDesc
            }
        });

        let successPopup = PopUp('Update', response.data.message);
        PopUpQueue(successPopup);
        return;
    }

    return <div className = 'description tab-content-container'>
    {
        isOwner === 'yes' &&
        <div className = 'edit' onClick = {handleEdit}>
            <EditIcon />
        </div>
    }

    <div className = 'description-content-container'>
        {
            desc ?
            <pre ref = {descRef} className = 'description-input' contentEditable = {false} onInput = {handleChange}>{desc}</pre>:
            <Empty text = 'Argh!' caption = 'No description found' GIF = 'https://c.tenor.com/UWKxURNg6TMAAAAC/mr-bean-what.gif' />
        }
        {
            isEditing &&
            <div className = 'update-btn' onClick = {handleUpdate}>Update</div>
        }
    </div>
</div>
}

export default CommunityDescription;