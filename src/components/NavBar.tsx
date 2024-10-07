import React, {createContext, useContext, useEffect, useState} from 'react';
import './components.sass'
import {Link, useLocation} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {removeManager} from "../store/slices/manager";
import {collection, getFirestore, onSnapshot} from "firebase/firestore";
import {IChat, IMessage} from "../interfaces";
import {pushNewMessage} from "../store/slices/messages";

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
    const manager = useAppSelector(state => state.manager.manager)
    const dispatch = useAppDispatch()
    const unreadMessages = useAppSelector(state => state.messages.chats.reduce((sum: number, chat: IChat | undefined) => {
        if (!chat) return sum
        return sum + chat.messages.filter((message: IMessage) => !message?.read && message?.uid !== manager.id).length;
    }, 0));


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

    useEffect(() => {
        const db = getFirestore();
        const chatRoomsRef = collection(db, 'chat_rooms');

        return onSnapshot(chatRoomsRef, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const chatRoomId = doc.id;
                const messagesRefInChatRoom = collection(db, `chat_rooms/${chatRoomId}/messages`);

                return onSnapshot(messagesRefInChatRoom, (querySnapshot1) => {
                    querySnapshot1.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            dispatch(pushNewMessage({messageData: change.doc.data(), chat_id: change.doc.ref.path.split('/')[1]}))

                        }
                        // else if (change.type === 'modified') {
                        //
                        // } else if (change.type === 'removed') {
                        //     console.log(`Message removed from chat room ${chatRoomId}:`, change.doc.data());
                        // }
                    });
                }, (error) => {
                    console.error(`Error reading messages in chat room ${chatRoomId}:`, error);
                });
            });
        }, (error) => {
            console.error('Error reading chat rooms:', error);
        });
    }, []);
    return (
        <nav>
            <div className={'full_navbar'}>
                {Object.keys(links).map((key) =>
                    <div
                        key={key}>
                        <Link className={
                            location.pathname === `/${key}` ||
                            location.pathname.slice(0, 9) === '/messages' && key === 'messages' ||
                            location.pathname.slice(0, 9) === '/managers' && key === 'managers' ||
                            location.pathname.slice(0, 7) === '/orders' && key === 'orders' ||
                            location.pathname.slice(0, 11) === '/deliveries' && key === 'deliveries'
                                ? 'active' : 'link'}
                              to={key !== 'messages' ? `/${key}` : `messages/accounting`}>
                            {links[key as keyof ILinks]}
                        </Link>
                        {unreadMessages !== 0 && key === 'messages' &&
                            <span
                                className={'notifications'}>
                        {unreadMessages}
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