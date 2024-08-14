import React, {createContext, useContext} from 'react';
import './components.sass'
import {Link, useLocation} from "react-router-dom";
import {useAppSelector} from "../hooks/redux-hooks";
interface ILinks {
    items: string
    orders: string
    managers?: string
    messages: string
    deliveries: string
}
const NavBar = () => {
    const isAdmin = useAppSelector(state => state.manager.manager.role) === 'admin'
    const location = useLocation();
    const links : ILinks = {
        items: 'Товары',
        orders: 'Заказы',
        deliveries: 'Посылки',
        managers: isAdmin ? 'Менеджеры' : '' ,
        messages: 'Сообщения',
    }
    return (
        <nav className={'navbar'}>
            {Object.keys(links).map((key) =>
                <Link className={location.pathname ===  `/${key}` ? 'active' : 'link'}
                      key={key}
                      to={`/${key}`}>{links[key as keyof ILinks]}</Link>
            )}
        </nav>
    );
};

export default NavBar;