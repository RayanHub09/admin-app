import React from 'react';
import './pages.sass'
import {Link} from "react-router-dom";

const ErrorFallback: React.FC = () => {
    return (
        <div className={'container'}>
            <span className={'navbar_error'}></span>
            <div className={'container_error'}>
                <h1>Произошла ошибка</h1>
                <p>Пожалуйста, попробуйте позже или вернитесь на главную страницу.</p>
                <p>Перейти на <Link to={'/orders'}>главную страницу</Link>.</p>
            </div>
        </div>
    );
};

export default ErrorFallback;
