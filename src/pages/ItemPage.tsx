import React from 'react';
import {useParams} from "react-router-dom";

const ItemPage = () => {
    const { id } = useParams<{ id: string }>()
    return (
        <div>

        </div>
    );
};

export default ItemPage;