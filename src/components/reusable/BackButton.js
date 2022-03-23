import '../../styles/header/BackButton.css';

import { useHistory } from 'react-router-dom';

import {ReactComponent as BackButtonIcon} from '../../images/back.svg';

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