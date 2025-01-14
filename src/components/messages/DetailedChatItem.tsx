import React, {FC, useEffect, useRef, useState} from 'react';
import {IChat, IMessage, IUser} from "../../interfaces";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import InputMessage from "./InputMessage";
import 'firebase/database';

import {fetchChangeReadMessage, fetchDeleteMessage} from "../../store/slices/messages";
import {useNavigate} from "react-router-dom";
import NotFoundPage from "../../pages/NotFoundPage";
import {getDate} from "../../functions/changeDate";

interface DetailedChatItemProps {
    chat: IChat
}

const DetailedChatItem: FC<DetailedChatItemProps> = ({chat}) => {
    const manager = useAppSelector(state => state.manager.manager)
    const temporaryMessage = useAppSelector(state => state.messages.temporaryMessage)
    const unreadMessages = chat.messages.filter(message => message.uid !== manager.id && !message.read).map(message => message.id)
    const role = useAppSelector(state => state.manager.manager.role)
    const dispatch = useAppDispatch()
    const statusSendMessage = useAppSelector(state => state.messages.statusSend)
    const user: IUser | undefined = useAppSelector(state =>
        state.users.users.find(user => user.id === chat.uid))
    const [loadingDelete, setLoadingDelete] = useState<{ [key: string]: boolean }>({});
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    function deleteMessage(messageId: string) {
        setLoadingDelete(prev => ({...prev, [messageId]: true}));
        dispatch(fetchDeleteMessage({chat_id: chat.id, message_id: messageId})).then(() => {
            setLoadingDelete(prev => ({...prev, [messageId]: false}));
        })
    }


    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({block: 'end', behavior: 'auto'})
        }
    }, [statusSendMessage])

    useEffect(() => {

        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({block: 'end', behavior: 'auto'})
        }
        const unreadMessages = chat.messages.filter(message => message.uid !== manager.id && !message.read).map(message => message.id)
        dispatch(fetchChangeReadMessage({chat_id: chat?.id, messages_id: unreadMessages}))

    }, [statusSendMessage])


    if (!chat?.messages) {
        <NotFoundPage/>
    }

    return (
        <div className={'detailed_chat_item'}>
            <div className={'info_user'}>
                <h2>{user?.name} {user?.surname}</h2>
            </div>

            <div className={'chat_messages_container'}>
                {chat?.messages?.map((message: IMessage, index) =>
                    <div
                        key={message.id}
                        className={chat.uid === message.uid ? 'user_message message' : 'manager_message message'}>
                        {chat.uid === message.uid ? <h4>{user?.name} {user?.surname}</h4> : <h4>{manager.name}</h4>}
                        <p
                            style={{paddingLeft: '10px'}}>{message?.text}</p>
                        { message.creationTime && <span
                            style={{paddingRight: '10px'}}
                            className={'status_message'}>
                                    {getDate(message.creationTime)[1].split(':')[0]}:{getDate(message.creationTime)[1].split(':')[1]}<span>  </span>
                            {getDate(message.creationTime)[0].split('.')[0]}.{getDate(message.creationTime)[0].split('.')[1]}
                            .{getDate(message.creationTime)[0].split('.')[2]}
                        </span>}
                        {message.attachedFiles?.length !== 0 &&
                            <img src={message.attachedFiles[0].uri}/>
                        }


                        <div className={'message_change_container'}>
                            {role === 'admin' &&
                                <button
                                    value={message.id}
                                    onClick={() => deleteMessage(message.id)}
                                    disabled={loadingDelete[message.id]}
                                    className={chat.uid === message.uid ? ('user_efault_button_delete default_button_delete') : 'default_button_delete '}
                                >
                                    {loadingDelete[message.id] ? 'Загрузка...' : 'Удалить'}
                                </button>

                            }
                            {
                                chat.uid !== message.uid &&
                                <span
                                    className={'status_message'}>{message.read ? 'Просмотрено' : 'Доставлено'}
                            </span>
                            }
                            {
                                index === chat.messages.length - 1 && chat.uid === message.uid &&
                                <span className={'yellow'}>Нет ответа</span>
                            }
                        </div>
                    </div>)}
                {statusSendMessage === 'loading' && temporaryMessage &&
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