import React from 'react'
import {useAppSelector} from "../../hooks/redux-hooks";
import {IRole, options} from "../../lists/roleList";
import ChatItem from "./ChatItem";
import {useLocation} from "react-router-dom";
import './messages.sass'


const SectionMessages = () => {
    const chats = useAppSelector(state => state.messages.chats)
    const section = useLocation().pathname.slice(10)
    return (
        <div className={'chat_list_container'}>
            {chats.map(chat => options[section as keyof IRole] === chat.department &&
                <ChatItem
                    key={chat.id}
                    chat={chat} />
            )}
        </div>
    );
};

export default SectionMessages;