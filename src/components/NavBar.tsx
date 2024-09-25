import React, {createContext, useContext, useState} from 'react';
import './components.sass'
import {Link, useLocation} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {removeManager} from "../store/slices/manager";

interface ILinks {
    items: string
    orders: string
    managers?: string
    messages: string
    deliveries: string
}

const NavBar = () => {
    const isAdmin = useAppSelector(state => state.manager.manager.role) === 'admin'
    const location = useLocation()
    const dispatch = useAppDispatch()
    const [isVisible, setIsVisible] = useState(false)
    const links: ILinks = {
        items: 'Товары',
        orders: 'Заказы',
        deliveries: 'Посылки',
        managers: isAdmin ? 'Менеджеры' : '',
        messages: 'Сообщения',
    }
    function showFullMenu() {
        setIsVisible(!isVisible)
    }
    return (
        <nav>
            <div className={'full_navbar'}>
                {Object.keys(links).map((key) =>
                    <Link className={location.pathname === `/${key}` ? 'active' : 'link'}
                          key={key}
                          to={`/${key}`}>{links[key as keyof ILinks]}</Link>
                )}
            </div>
            <div className="short_navbar">
                <button
                    className={isVisible ? "hamburger hamburger--chop active" : "hamburger hamburger--chop"}
                    type="button"
                    onClick={showFullMenu}
                >
                    <div className="inner">
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                </button>
                <div className={isVisible ? "dropdown-content show" : "dropdown-content"}>
                    {Object.keys(links).map((key) =>
                        <Link className={'link'}
                              key={key}
                              onClick={() => setIsVisible(false)}
                              to={`/${key}`}>{links[key as keyof ILinks]}</Link>
                    )}
                    <a
                        className={'button_out link'}
                        onClick={() => dispatch(removeManager())}
                    >Выйти</a>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;