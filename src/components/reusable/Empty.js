import '../../styles/reusable/Empty.css';

const Empty = ({text, caption, GIF}) => {
    return <div className = 'empty'>
    <h3>{text}</h3>

    <p className = 'empty-caption'>{caption}</p>
    
    <img src = {GIF} alt = '' className = 'empty-gif' />
</div>
}

export default Empty;