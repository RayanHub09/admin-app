import React, {createContext, useContext, useEffect, useState} from 'react';
import './components.sass'
import {Link, useLocation} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {removeManager} from "../store/slices/manager";
import {IChat, IDelivery, IMessage, IOrder} from "../interfaces";

interface ILinks {
    items: string
    orders: string
    managers?: string
    messages: string
    deliveries: string
    users: string
}

const NavBar = () => {
    const dispatch = useAppDispatch()
    const isAdmin = useAppSelector(state => state.manager.manager?.role) === 'admin'
    const location = useLocation()
    const manager = useAppSelector(state => state.manager.manager)
    const count_unanswered_messages = useAppSelector(state => {
        const chats = state.messages.chats || [];
        return chats.filter(chat =>
            chat.messages && chat.messages[chat.messages.length - 1]?.uid === chat.uid && chat.messages.length !== 0
        ).length;
    });

    const unreadMessages = useAppSelector(state => {
        const chats = state.messages.chats || [];
        return chats.reduce((sum: number, chat: IChat | undefined) => {
            if (!chat || !chat.messages) return sum;
            return sum + chat.messages.filter((message: IMessage) => !message?.read && message?.uid === chat.uid).length;
        }, 0);
    });



    const [isVisible, setIsVisible] = useState(false)
    const links: ILinks = {
        items: 'Товары',
        orders: 'Заказы',
        deliveries: 'Посылки',
        managers: isAdmin ? 'Менеджеры' : '',
        messages: 'Сообщения',
        users: 'Покупатели',
    }

    function showFullMenu() {
        setIsVisible(!isVisible)
    }


    return (
        <nav>
            <div className={'full_navbar'}>
                {Object.keys(links).map((key) =>
                    <div
                        key={key}>

                        <Link className={
                            location.pathname === `/${key}` ||
                            location.pathname.split('/')[1] === 'messages' && key === 'messages' ||
                            location.pathname.split('/')[1] === 'managers' && key === 'managers' ||
                            location.pathname.split('/')[1] === 'orders' && key === 'orders' ||
                            location.pathname.split('/')[1] === 'deliveries' && key === 'deliveries' ||
                            location.pathname.split('/')[1] === 'users' && key === 'users'
                                ? 'active' : 'link'}
                              to={key !== 'messages' ? `/${key}` : `messages/accounting`}>
                            {links[key as keyof ILinks]}
                        </Link>
                        {unreadMessages !== 0 && key === 'messages' &&
                            <span
                                className={'notifications red_notifications'}>
                        {unreadMessages}
                    </span>}
                        {key === 'messages' && count_unanswered_messages - unreadMessages > 0 && <span
                            className={'notifications yellow_notifications'}>
                        {count_unanswered_messages - unreadMessages}
                    </span>}

                    </div>
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
                              to={key !== 'messages' ? `/${key}` : `messages/accounting`}>
                            {links[key as keyof ILinks]}
                            {unreadMessages !== 0 && key === 'messages' &&
                                <span
                                    className={'notifications red_notifications'}>
                        {unreadMessages}
                    </span>}
                            {key === 'messages' && count_unanswered_messages - unreadMessages > 0 && <span
                                className={'notifications yellow_notifications'}>
                        {count_unanswered_messages - unreadMessages}
                    </span>}
                        </Link>

                    )}

                    <a
                        className={'button_out_ link'}
                        onClick={() => dispatch(removeManager())}
                    >Выйти</a>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;