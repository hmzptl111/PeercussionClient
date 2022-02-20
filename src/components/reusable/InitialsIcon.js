import '../../styles/reusable/InitialsIcon.css';

const InitialsIcon = ({initial, isBig}) => {
    return <div className = {isBig ? 'default-initials-icon-big': 'default-initials-icon'} >
            {
                initial.toUpperCase()
            }
        </div>;
}

export default InitialsIcon;