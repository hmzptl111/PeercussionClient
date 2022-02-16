import {useEffect, useRef, useState} from 'react';

import axios from 'axios';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../reusable/PopUp';

import {Link} from 'react-router-dom';

const SetUserProfileUsingCamera = () => {
    navigator.getMedia =    navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia;

    const videoRef = useRef();
    const canvasRef = useRef();
    const imageRef = useRef();
    
    const [hasCaptured, setHasCaptured] = useState(false);
    const [isUserProfileSet, setIsUserProfileSet] = useState(false);
    
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

    const handleSetProfilePicture = async () => {
        // console.log(canvasRef.current.toDataURL('image/jpeg'));
        const payload = {
            profilePicture: canvasRef.current.toDataURL('image/jpeg')
        }
        const response = await axios.post('/setProfilePictureFromCamera', payload);
        // if(response.status === 200) {
        //     console.log(response.data.message);
        //     setIsUserProfileSet(true);
        // }
        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        setIsUserProfileSet(true);
        let successPopup = PopUp('Profile picture updated',
            <Link to = '/profilePicture/view'>View updated profile picture</Link>
        );
        PopUpQueue(successPopup);
        return;
    }

    return <>
            <video ref = {videoRef} width = '400' height = '300'></video>

            <canvas ref = {canvasRef} width = '400' height = '300' style = {{display: 'none'}}></canvas>
            
            <img ref = {imageRef} width = '400' height = '300' style = {{display: 'none'}} alt = ''></img>
            
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
