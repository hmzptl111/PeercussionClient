import '../../styles/profile/SetUserProfileUsingCamera.css';

import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import axios from 'axios';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../reusable/PopUp';

import {ReactComponent as CameraIcon} from '../../images/camera.svg';
import {ReactComponent as SubmitIcon} from '../../images/check.svg';


const SetUserProfileUsingCamera = () => {
    navigator.getMedia =    navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia;

    const videoRef = useRef();
    const canvasRef = useRef();
    
    const [hasCaptured, setHasCaptured] = useState(false);
    const [isUserProfileSet, setIsUserProfileSet] = useState(false);
    
    let history = useHistory();


    useEffect(() => {
        let streamTrack;
        navigator.getMedia({
            video: true,
            audio: false
        }, (stream) => {
            streamTrack = stream;
            videoRef.current.srcObject = stream;
            videoRef.current.play();
        }, (err) => {
            if(err) {
                let errorPopup = PopUp('Something went wrong', err);
                PopUpQueue(errorPopup);
                return;
            }
        });

        return () => streamTrack.getTracks().forEach(track => track.stop());
    }, []);


    const handleCapture = () => {
        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, videoRef.current.width, videoRef.current.height);

        if(hasCaptured) {
            //recapture
            setHasCaptured(false);
            setIsUserProfileSet(false);
            videoRef.current.play();
            
            canvasRef.current.style.display = 'none';
            videoRef.current.style.display = 'block';
        } else {
            //capture
            setHasCaptured(true);
            setIsUserProfileSet(false);
            videoRef.current.pause();
            
            videoRef.current.style.display = 'none';
            canvasRef.current.style.display = 'block';
        }
    }

    const handleSetProfilePicture = async () => {
        const payload = {
            profilePicture: canvasRef.current.toDataURL('image/jpeg')
        }

        const response = await axios.post('/setProfilePicture', payload);

        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        history.replace('/profilePicture/view');
    }


    return <>
    <div className = 'profile-picture-container'>
        <div onClick = {handleCapture} className = 'profile-picture-header'>
            <CameraIcon />
            {
                hasCaptured ?
                'Recapture':
                'Capture'
            }
        </div>
        
        {
            hasCaptured && !isUserProfileSet &&
            <div onClick={handleSetProfilePicture} className = 'profile-picture-header'>
                <SubmitIcon />
                Update
            </div>
        }
    </div>


    <div className = 'preview-capture-container'>
        <video ref = {videoRef} width = '300px' height = '300px' />

        <canvas ref = {canvasRef} width = '300px' height = '300px' style = {{display: 'none'}} />
    </div>

    <Popup />
</>
}

export default SetUserProfileUsingCamera;