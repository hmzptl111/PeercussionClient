import '../../styles/community/CommunityDescription.css';

import Empty from '../reusable/Empty';

const CommunityDescription = ({desc}) => {
    return <div className = 'description'>
        {
            desc ?
            <pre>{desc}</pre> :
            <Empty text = 'Argh!' caption = 'No description found' GIF = 'https://c.tenor.com/UWKxURNg6TMAAAAC/mr-bean-what.gif' />
        }
    </div>
}

export default CommunityDescription;