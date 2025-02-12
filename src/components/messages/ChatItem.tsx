import React, { FC } from 'react';
import { IChat, IMessage, IUser } from "../../interfaces";
import { useAppSelector } from "../../hooks/redux-hooks";
import { Link } from "react-router-dom";
import { IRole, options } from "../../lists/roleList";
import { getDate } from "../../functions/changeDate";

interface ChatItemProps {
    chat: IChat;
}

const ChatItem: FC<ChatItemProps> = ({ chat }) => {
    const user: IUser | undefined = useAppSelector(state =>
        state.users.users.find(user => user.id === chat.uid)
    );
    const manager = useAppSelector(state => state.manager.manager);
    const department = Object.keys(options).find(key => options[key as keyof IRole] === chat.department);
    const messages = chat?.messages || [];
    const unreadMessages = messages.filter((message: IMessage) => message?.uid === chat.uid && !message?.read).length;
    const lastMessage = messages[messages.length - 1];
    const lastMessageText = lastMessage ?
        (lastMessage.text.split(' ').length > 4 ? lastMessage.text.split(' ').slice(0, 4).join(' ') + ' ...' : lastMessage.text)
        : 'Нет сообщений';
    const lastMessageSender = lastMessage ? (lastMessage.uid === user?.id ? `${user?.name} ${user?.surname}` : 'Менеджер') : '';
    const lastMessageTime = lastMessage ? getDate(lastMessage.creationTime) : ['', ''];

    return (
        <Link to={`/messages/${department}/${chat.id}`} className={'link_chat'}>
            <div className={unreadMessages !== 0 ? 'chat_item_container notifications_chat_item_container' : 'chat_item_container'}>
                <div>
                    <div className={'container_chat'}>
                        <h4>{user?.name} {user?.surname}</h4>
                        <p>Тема: {chat.theme}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {messages.length !== 0 ?
                            <>
                                <p style={{ paddingLeft: '10px' }}>
                                    {lastMessageSender}: <>{lastMessageText}</>
                                </p>
                                {!isNaN(+lastMessageTime[1].split(':')[0]) ?
                                    <p style={{ alignSelf: "center" }} className={'status_message'}>
                                        {lastMessageTime[1].split(':')[0]}:{lastMessageTime[1].split(':')[1]} <span> </span>
                                        {lastMessageTime[0].split('.')[0]}.{lastMessageTime[0].split('.')[1]}
                                    </p> :
                                    <p style={{ alignSelf: "center" }} className={'status_message'}>
                                        отправка...

                                    </p>
                                }
                            </> :
                            <p className={'no_messages'}>Нет сообщений</p>
                        }
                    </div>
                </div>
                {messages.length !== 0 && lastMessage?.uid === chat.uid && unreadMessages !== 0 &&
                    <span className={'unread_messages'}>Непрочитанное сообщение</span>}
                {messages.length !== 0 && lastMessage?.uid === chat.uid && unreadMessages === 0 &&
                    <span className={'unread_messages_yellow'}>Нет ответа</span>}
            </div>
        </Link>
    );
};

export default ChatItem;
