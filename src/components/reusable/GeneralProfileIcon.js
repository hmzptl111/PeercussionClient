import '../../styles/reusable/GeneralProfileIcon.css';

const GeneralProfileIcon = ({imageSource, imageID}) => {
    return <>
            {
                imageSource && imageID &&
                <img src = {`/uploads/${imageSource}/${imageID}`} className = 'profile-icon' alt = '' />
            }
        </>
}

export default GeneralProfileIcon;