import { useHistory } from "react-router-dom";

import '../../styles/header/BackButton.css';

import {ReactComponent as BackButtonIcon} from '../../images/left_arrow.svg';

const BackButton = () => {
    let history = useHistory();

    const handleGoBack = () => {
        history.goBack();
    }

    return <div onClick = {handleGoBack} className = 'back-button'>
                <BackButtonIcon />
        </div>
}

export default BackButton;