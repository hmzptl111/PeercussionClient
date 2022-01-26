import '../../styles/reusable/InitialsIcon.css';

const InitialsIcon = ({initial, isUpperCase = false, isComment = false}) => {
    return <div className = 'default-initials-icon' style = {{width: isComment && '2em', height: isComment && '2em'}}>
            {
                isUpperCase ?
                initial.toUpperCase():
                initial
            }
        </div>;
}

export default InitialsIcon;