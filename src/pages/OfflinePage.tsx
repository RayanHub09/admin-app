import React from 'react';
import {Link} from "react-router-dom";

const OfflinePage: React.FC = () => {
    return (
    <div className={'container'}>
        <div className={'container_error'}>
            <h1>Нет подключения к интернету</h1>
            <p>Пожалуйста, проверьте ваше подключение и попробуйте снова.</p>
        </div>
    </div>
    );
};

export default OfflinePage;
