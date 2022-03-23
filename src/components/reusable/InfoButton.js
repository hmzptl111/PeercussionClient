import '../../styles/reusable/InfoButton.css';

import {ReactComponent as InfoButtonIcon} from '../../images/info.svg';

import { PopUp, PopUpQueue } from './PopUp';


const InfoButton = ({content}) => {
    const handleInfoButtonClick = () => {
        if(!content) return;

        let infoPopup = PopUp('Help', content);
        PopUpQueue(infoPopup);
    }

    return <div className = 'info'>
    <InfoButtonIcon onClick = {handleInfoButtonClick} />
</div>
}

export default InfoButton;