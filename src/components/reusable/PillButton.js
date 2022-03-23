import '../../styles/reusable/PillButton.css';

import React from 'react';

const PillButton = ({buttonText, handleRemove}) => {
    
    return <div className = 'pill'>
    {buttonText}
    {
        handleRemove &&
        <span className = 'remove-pill' onClick = {() => handleRemove && handleRemove(buttonText)}>&#10006;</span>
    }
</div>
};

export default PillButton;