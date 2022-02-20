const FormatToKMBT = ({number}) => {
    if (number === null) return;
    if (number === 0) return '0'

    const b = (number).toPrecision(2).split('e');
    const k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3);
    const c = k < 1 ? number.toFixed() : (number / Math.pow(10, k * 3) ).toFixed(2);
    const d = c < 0 ? c : Math.abs(c);
    const e = d + ['', 'k', 'M', 'B', 'T'][k];
    
    return e;
}

export default FormatToKMBT;