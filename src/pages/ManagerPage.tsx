import React from 'react';
import {useParams} from "react-router-dom";



const ManagerPage = () => {
    const { id } = useParams();
    return (
        <div>
            {id}
        </div>
    );
};

export default ManagerPage;