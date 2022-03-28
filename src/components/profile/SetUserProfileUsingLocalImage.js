import '../../styles/profile/SetUserProfileUsingLocalImage.css';

import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import axios from 'axios';

import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import {ReactComponent as UploadIcon} from '../../images/upload.svg';
import {ReactComponent as SubmitIcon} from '../../images/check.svg';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../reusable/PopUp';


const SetUserProfileUsingLocalImage = () => {
    const [imageFromDevice, setImageFromDevice] = useState(null);
    const [image, setImage] = useState();
    const [crop, setCrop] = useState({
        aspect: 1 / 1,
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25
    });

    let history = useHistory();
    

    const getCroppedImg = (isBlob = false) => {
        if(!image || !crop) return;

        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");
      
        const pixelRatio = window.devicePixelRatio;
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";
      
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );
      
        if(isBlob) {
            return new Promise((resolve, reject) => {
                canvas.toBlob(
                    (blob) => {
                    resolve(blob);
                  },
                  "image/jpeg",
                  1
                );
            });
        } else {
            const base64Image = canvas.toDataURL("image/jpeg");

            return new Promise((resolve, reject) => {
                resolve(base64Image);
            });
        }
    }

    const handleImageFromDeviceSelected = e => {
        if(!e.target.files[0]) return;

        setImageFromDevice(URL.createObjectURL(e.target.files[0]));
    }
    

    const handleSetProfilePictureFromDevice = async () => {
        const croppedImage = await getCroppedImg();

        const payload = {
            profilePicture: croppedImage
        }

        const response = await axios.post('/setProfilePicture', payload);

        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        history.replace('/profilePicture/view');
    }

    const handleImageLoaded = e => {
        setImage(e.target);
    }

    
    return <>
    <div className = 'profile-picture-container'>
        <label htmlFor = 'user-uploaded-profile-picture' className = 'profile-picture-header'>
            <UploadIcon />
            Upload
            
            <input type = 'file' id = 'user-uploaded-profile-picture' name = 'user-uploaded-profile-picture' onChange = {handleImageFromDeviceSelected} />
        </label>

        <div onClick = {handleSetProfilePictureFromDevice} className = 'profile-picture-header'>
            <SubmitIcon />
            Update
        </div>
    </div>

    {
        imageFromDevice &&
        <div className = 'preview-image-container'>
            <div className = 'preview-image'>
                <ReactCrop src = {imageFromDevice} aspect = {1 / 1} crop = {crop} onChange = {setCrop}>
                    <img src = {imageFromDevice} onLoad = {handleImageLoaded} alt = '' />
                </ReactCrop>
            </div>
        </div>
    }

    <Popup />
</>
}

export default SetUserProfileUsingLocalImage;