import {useEffect, useRef, useState} from 'react';

import { useHistory } from 'react-router-dom';

import axios from 'axios';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../reusable/PopUp';

import {ReactComponent as ViewProfilePicture} from '../../images/user_default_profile.svg';

const SetUserProfileUsingCamera = () => {
    navigator.getMedia =    navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia;

    const videoRef = useRef();
    const canvasRef = useRef();
    const imageRef = useRef();
    
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
        console.log('image captured');
        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, videoRef.current.width, videoRef.current.height);        

        if(hasCaptured) {
            //recapture
            setHasCaptured(false);
            setIsUserProfileSet(false);
            videoRef.current.play();
            
            imageRef.current.style.display = 'none';
            imageRef.current.setAttribute('src', '');
            videoRef.current.style.display = 'block';
        } else {
            //capture
            setHasCaptured(true);
            setIsUserProfileSet(false);
            videoRef.current.pause();
            
            videoRef.current.style.display = 'none';
            imageRef.current.setAttribute('src', canvasRef.current.toDataURL('image/png'));
            imageRef.current.style.display = 'block';
        }
        
    }

    const handleViewProfilePicture = () => {
        Popup.close();
        history.push('/profilePicture/view');
    }

    const handleSetProfilePicture = async () => {
        const payload = {
            profilePicture: canvasRef.current.toDataURL('image/jpeg')
        }
        const response = await axios.post('/setProfilePictureFromCamera', payload);

        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        setIsUserProfileSet(true);
        let successPopup = PopUp('Profile picture updated',
            <div to = '/profilePicture/view' onClick = {handleViewProfilePicture} style = {{cursor: 'pointer'}}>
                <ViewProfilePicture />
                View updated profile picture
            </div>
        );
        PopUpQueue(successPopup);
        return;
    }

    return <>
            <video ref = {videoRef} width = '300' height = '300'></video>

            <canvas ref = {canvasRef} width = '300' height = '300' style = {{display: 'none'}}></canvas>
            
            <img ref = {imageRef} width = '300' height = '300' style = {{display: 'none'}} alt = ''></img>
            
            <button onClick = {handleCapture}>
                {
                    hasCaptured ?
                    'Recapture':
                    'Capture'
                }
            </button>
            
            {
                hasCaptured && !isUserProfileSet &&
                <button onClick={handleSetProfilePicture}>Set Profile Picture</button>
            }

            <Popup />
        </>
}

export default SetUserProfileUsingCamera;
