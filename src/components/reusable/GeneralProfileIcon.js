import '../../styles/reusable/GeneralProfileIcon.css';

const GeneralProfileIcon = ({imageSource, imageID, isComment = false}) => {
    return <>
            {
                imageSource && imageID &&
                <img src = {`/uploads/${imageSource}/${imageID}`} style = {{width: isComment && '2em', height: isComment && '2em'}} className = 'profile-icon' alt = '' />
            }
        </>
}

export default GeneralProfileIcon;