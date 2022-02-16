import '../../styles/reusable/InitialsIcon.css';

const InitialsIcon = ({initial}) => {
    return <div className = 'default-initials-icon' >
            {
                initial.toUpperCase()
            }
        </div>;
}

export default InitialsIcon;