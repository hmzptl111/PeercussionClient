import '../../styles/community/CommunityDescription.css';

const CommunityDescription = ({desc}) => {
    return <div className = 'description'>
        {
            desc ?
            <pre>{desc}</pre> :
            'Community has no description'
        }
    </div>
}

export default CommunityDescription;