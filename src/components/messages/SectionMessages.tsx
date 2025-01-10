import React from 'react';
import { useAppSelector } from "../../hooks/redux-hooks";
import { IRole, options } from "../../lists/roleList";
import ChatItem from "./ChatItem";
import { useLocation } from "react-router-dom";
import './messages.sass';

const SectionMessages = () => {
    const chats = useAppSelector(state => state.messages.chats);
    const section = useLocation().pathname.slice(10);
    const filteredChats = chats.filter(chat => options[section as keyof IRole] === chat?.department);

    return (
        <div className={'chat_list_container'}>
            {filteredChats.length > 0 ? (
                filteredChats.map(chat => (
                    <ChatItem
                        key={chat.id}
                        chat={chat}
                    />
                ))
            ) : (
                <div className="no_chats_message">
                    Пока нет подходящих чатов.
                </div>
            )}
        </div>
    );
};

export default SectionMessages;
