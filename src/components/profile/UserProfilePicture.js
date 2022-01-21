import { useParams } from "react-router-dom";

import EditUserProfilePicture from "./EditUserProfilePicture";
import ViewUserProfilePicture from "./ViewUserProfilePicture";

const EditUserProfile = () => {
    const {action} = useParams();

    return <>
            {
                action === 'view' &&
                <ViewUserProfilePicture />
            }
            {
                action === 'edit' &&
                <EditUserProfilePicture />
            }
        </>
}

export default EditUserProfile;