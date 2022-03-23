import '../../styles/reusable/ScrollToTop.css';

import {ReactComponent as ScrollToTopIcon} from '../../images/scroll_to_top.svg';

const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const ScrollToTop = () => {
    return <div className = 'scroll-to-top' onClick = {handleScrollToTop}>
    <ScrollToTopIcon />
</div>;
}

export default ScrollToTop;