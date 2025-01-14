import React, {FC} from 'react';
import {IChat, IMessage, IUser} from "../../interfaces";
import {useAppSelector} from "../../hooks/redux-hooks";
import {Link} from "react-router-dom";
import {IRole, options} from "../../lists/roleList";
import {getDate} from "../../functions/changeDate";

interface ChatItemProps {
    chat: IChat
}


const ChatItem: FC<ChatItemProps> = ({chat}) => {
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
            <div
                className={unreadMessages !== 0 ? 'chat_item_container notifications_chat_item_container' : 'chat_item_container'}>
                <div>
                    <h4>{user?.name} {user?.surname}</h4>
                    <div style={{display: 'flex', gap: '10px'}}>
                        <p style={{paddingLeft: '10px'}}>{messages[messages.length - 1]?.uid === user?.id ? <>{user?.name} {user?.surname}</> : <>{manager.name}</>}: <>{messages[messages.length - 1]?.text}</>
                        </p>
                        <p
                            style={{alignSelf: "center"}}
                            className={'status_message'}>
                            {getDate(messages[messages.length - 1]?.creationTime)[1].split(':')[0]}:
                            {getDate(messages[messages.length - 1]?.creationTime)[1].split(':')[1]} <span> </span>
                            {getDate(messages[messages.length - 1]?.creationTime)[0].split('.')[0]}.
                            {getDate(messages[messages.length - 1]?.creationTime)[0].split('.')[1]}
                        </p>
                    </div>
                </div>
                {(messages[messages.length - 1]?.uid !== manager.id && unreadMessages !== 0) &&
                    <span className={'unread_messages'}>Непрочитанное сообщение</span>}
                {(messages[messages.length - 1]?.uid !== manager.id && unreadMessages === 0) &&
                    <span className={'unread_messages_yellow'}>Нет ответа</span>}
            </div>
        </Link>
    );
};

export default ChatItem;