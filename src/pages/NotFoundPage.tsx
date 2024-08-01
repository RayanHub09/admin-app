import React from 'react';
import {Link} from "react-router-dom";
import {useAppSelector} from "../hooks/redux-hooks";

const NotFoundPage = () => {
    const isAuth = useAppSelector(state => state.manager.isAuth)
    return (
        <div className={'not_found_page_container'}>
            <h1>404 - Страница не найдена</h1>
            <p>К сожалению, запрашиваемая страница не найдена. Возможно, она была удалена или перемещена.</p>
            {isAuth && <p>Перейти на <Link to={'/orders'}>главную страницу</Link>.</p>}
            {!isAuth && <p>Перейти на страницу <Link to={'/'}>авторизации</Link></p>}
        </div>
    );
};

export default NotFoundPage;