import Popup from 'react-popup';

export const PopUp = (title, content) => {
    let popup = Popup.register({
        title: title,
        content: content
        // buttons: {
        //     left: [{
        //         text: 'Close',
        //         className: 'danger',
        //         action: () => {
        //             Popup.close();
        //         }
        //     }],
        //     right: [{
        //         text: 'Okay',
        //         className: 'success',
        //         action: () => {
        //             Popup.close();
        //         }
        //     }],
        // }
    });

    return popup;
}

export const PopUpQueue = (popup) => {
    Popup.close();
    Popup.queue(popup);
}