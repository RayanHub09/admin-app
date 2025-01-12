import React, {FC} from 'react';
import {IChat, IMessage, IUser} from "../../interfaces";
import {useAppSelector} from "../../hooks/redux-hooks";
import {Link} from "react-router-dom";
import {IRole, options} from "../../lists/roleList";

interface ChatItemProps {
    chat: IChat
}


const ChatItem:FC<ChatItemProps> = ({chat}) => {
    const user: IUser | undefined = useAppSelector(state =>
        state.users.users.find(user => user.id === chat.uid))
    const manager = useAppSelector(state => state.manager.manager)
    const department = Object.keys(options).find(key => options[key as keyof IRole] === chat.department)
    const messages = chat.messages
    const unreadMessages = chat.messages.filter((message: IMessage) => {
        return message?.uid !== manager.id && !message?.read
    }).length
    return (
        <Link to={`/messages/${department}/${chat.id}`} className={'link_chat'}>
            <div className={ unreadMessages !== 0 ?  'chat_item_container notifications_chat_item_container' : 'chat_item_container'}>
                <div>
                    <h4>{user?.name} {user?.surname}</h4>
                    <p style={{paddingLeft: '10px'}}>{messages[messages.length - 1 ]?.uid === user?.id ? <>{user?.name} {user?.surname}</> : <>{manager.name}</>}: <>{messages[messages.length - 1]?.text}</></p>
                </div>
                {/*{unreadMessages !== 0 && <span className={'unread_messages'}>{unreadMessages}</span>}*/}
                {(messages[messages.length - 1]?.uid !== manager.id && unreadMessages !== 0) &&  <span className={ 'unread_messages' }>Непрочитанное сообщение</span> }
                {(messages[messages.length - 1]?.uid !== manager.id && unreadMessages === 0) && <span className={ 'unread_messages_yellow' }>Нет ответа</span>}
            </div>
        </Link>
    );
};

export default ChatItem;