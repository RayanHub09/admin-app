import React, {createContext, useContext} from 'react';
import './components.sass'
import {Link} from "react-router-dom";
interface ILinks {
    orders: string,
    managers: string,
    messages: string
}
const NavBar = () => {
    const links : ILinks = {
        orders: 'Заказы',
        managers: 'Менеджеры',
        messages: 'Сообщения'
    }
    return (
        <nav className={'navbar'}>
            {Object.keys(links).map((key) =>
                <Link className={'link'} key={key} to={`/${key}`}>{links[key as keyof ILinks]}</Link>
            )}
        </nav>
    );
};

export default NavBar;