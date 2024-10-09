import React, {FC, useEffect, useRef} from 'react';
import {IChat, IUser} from "../../interfaces";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import InputMessage from "./InputMessage";
import 'firebase/database';

import {fetchChangeReadMessage} from "../../store/slices/messages";
import {useNavigate} from "react-router-dom";

interface DetailedChatItemProps {
    chat: IChat
}

const DetailedChatItem: FC<DetailedChatItemProps> = ({chat}) => {
    const manager = useAppSelector(state => state.manager.manager)
    const isAuth = useAppSelector(state => state.manager.isAuth)
    const temporaryMessage = useAppSelector(state => state.messages.temporaryMessage)
    const unreadMessages = useAppSelector(state => state.messages.chats.flatMap(chat => {
        return chat.messages.filter(message => message.uid !== manager.id && !message.read).map(message => message.id);
    }));

    const navigation = useNavigate()
    const dispatch = useAppDispatch()
    const statusSendMessage = useAppSelector(state => state.messages.statusSend)
    const user: IUser | undefined = useAppSelector(state =>
        state.users.users.find(user => user.id === chat.uid))


    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({block: 'end', behavior: 'auto'})
        }
    }, [statusSendMessage])

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({block: 'end', behavior: 'auto'})
        }
        dispatch(fetchChangeReadMessage({chat_id: chat?.id, messages_id: unreadMessages}))
    }, [])


    if (!chat?.messages) {
        navigation('/orders')
    }

    return (
        <div className={'detailed_chat_item'}>
            <div className={'info_user'}>
                <h2>{user?.name} {user?.surname}</h2>
            </div>
            <div className={'chat_messages_container'}>
                {chat?.messages?.map(message =>
                    <div
                        key={message.id}
                        className={chat.uid === message.uid ? 'user_message message' : 'manager_message message'}>
                        {chat.uid === message.uid ? <h4>{user?.name} {user?.surname}</h4> : <h4>{manager.name}</h4>}
                        <p style={{paddingLeft: '10px'}}>{message?.text}</p>
                        {message.attachedFiles.length !== 0 &&
                            <img src={message.attachedFiles[0].url}/>
                        }
                        {
                            chat.uid !== message.uid &&
                            <span className={'status_message'}>{message.read ? 'Просмотрено' : 'Доставлено'}</span>
                        }
                    </div>)}
                {statusSendMessage === 'loading' &&
                    <div className={'manager_message message'}>
                        <h4>{manager.name}</h4>
                        <p style={{paddingLeft: '10px'}}>{temporaryMessage}</p>
                        <span className={'status_message'}>Отправка...</span>
                    </div>
                }
                {statusSendMessage === 'failed' &&
                    <div className={'manager_message message error'}>
                        <span className={'status_message'}>Что-то пошло не так :(</span>
                    </div>}
                <div ref={messagesEndRef}/>
            </div>

            <InputMessage chat_id={chat?.id} uid={chat?.uid}/>
        </div>
    );
};

export default DetailedChatItem;