import React from 'react';
import '../../styles/reusable/PillButton.css';

import { primaryLighterColor } from '../../index';

const PillButton = ({buttonText, width = 'fit-content', backgroundColor = primaryLighterColor, handleRemove}) => {
    
    return(
        <div className = 'pill' style = {{backgroundColor, width}}>
            {buttonText}
            {
                handleRemove &&
                <span className = 'remove-pill' onClick = {() => handleRemove && handleRemove(buttonText)}>&#10006;</span>
            }
        </div>
    );
};

export default PillButton;