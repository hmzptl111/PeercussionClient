const CommunityDescription = ({desc}) => {
    return <>
        {
            desc ?
            desc :
            'No description'
        }
    </>
}

export default CommunityDescription;