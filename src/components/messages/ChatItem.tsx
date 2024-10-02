import React, {FC} from 'react';
import {IChat, IUser} from "../../interfaces";
import {useAppSelector} from "../../hooks/redux-hooks";
import {Link} from "react-router-dom";

interface ChatItemProps {
    chat: IChat
}


const ChatItem:FC<ChatItemProps> = ({chat}) => {
    const user: IUser | undefined = useAppSelector(state =>
        state.users.users.find(user => user.id === chat.uid))
    const messages = chat.messages
    return (
        <Link to={`/messages/${chat.department}/${chat.id}`} className={'link_chat'}>
            <div className={'chat_item_container'}>
                <h4>{user?.name} {user?.surname}</h4>
                <p style={{paddingLeft: '10px'}}>{user?.name} {user?.surname}: {messages[messages.length - 1].text}</p>
            </div>
        </Link>
    );
};

export default ChatItem;