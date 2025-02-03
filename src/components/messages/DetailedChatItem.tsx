import React, { FC, useEffect, useRef, useState } from 'react';
import { IChat, IMessage, IUser } from "../../interfaces";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import InputMessage from "./InputMessage";
import 'firebase/database';
import { fetchChangeReadMessage, fetchDeleteChat, fetchDeleteMessage } from "../../store/slices/messages";
import { useLocation, useNavigate } from "react-router-dom";
import NotFoundPage from "../../pages/NotFoundPage";
import { getDate } from "../../functions/changeDate";
import ShadowWindow from "../ShadowWindow";

interface DetailedChatItemProps {
    chat: IChat;
}

const DetailedChatItem: FC<DetailedChatItemProps> = ({ chat }) => {
    const manager = useAppSelector(state => state.manager.manager);
    const temporaryMessage = useAppSelector(state => state.messages.temporaryMessage);
    const role = useAppSelector(state => state.manager.manager.role);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigation = useNavigate();
    const statusSendMessage = useAppSelector(state => state.messages.statusSend);
    const user: IUser | undefined = useAppSelector(state => state.users.users.find(user => user.id === chat.uid));
    const [loadingDelete, setLoadingDelete] = useState<{ [key: string]: boolean }>({});
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const statusDeleteChat = useAppSelector(state => state.messages.statusDeleteChat);
    const [visibleWindow, setVisibleWindow] = useState(false);
    const [visibleChatDeleteWindow, setVisibleChatDeleteWindow] = useState(false); // Новое состояние для окна удаления чата
    const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

    const deleteMessage = (messageId: string) => {
        setLoadingDelete(prev => ({ ...prev, [messageId]: true }));
        dispatch(fetchDeleteMessage({ chat_id: chat.id, message_id: messageId }))
            .then(() => {setLoadingDelete(prev => ({ ...prev, [messageId]: false }))

        })
            .then(() => setVisibleWindow(false))
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ block: 'end', behavior: 'auto' });
        }
    }, [statusSendMessage]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ block: 'end', behavior: 'auto' });
        }
        const unreadMessages = chat.messages?.filter(message => message.uid !== manager.id && !message.read).map(message => message.id);
        dispatch(fetchChangeReadMessage({ chat_id: chat?.id, messages_id: unreadMessages }));
    }, [statusSendMessage]);



    const confirmDeleteChat = () => {
        setVisibleChatDeleteWindow(true)
    };

    const deleteChat = () => {
        dispatch(fetchDeleteChat({ chat_id: chat.id })).then(() =>
            navigation('/' + location.pathname.split('/')[1] + '/' + location.pathname.split('/')[2])
        );
    };

    return (
        <div className={'detailed_chat_item'}>
            <div className={'info_user'}>
                <h2>{chat.theme}</h2>
            </div>
            {(chat.messages ? chat.messages.length !== 0 : chat.messages) ?
                <div className={'chat_messages_container'}>
                    {chat.messages.map((message: IMessage, index) =>
                        <div
                            key={message.id}
                            className={chat.uid === message.uid ? 'user_message message' : 'manager_message message'}>
                            {chat.uid === message.uid ? <h4>{user?.name} {user?.surname}</h4> : <h4>Менеджер</h4>}
                            <p style={{ paddingLeft: '10px'}}>{message.text}</p>
                            {message.creationTime && <span style={{ paddingRight: '10px' }} className={'status_message'}>
                                {getDate(message.creationTime)[1].split(':')[0]}:{getDate(message.creationTime)[1].split(':')[1]}<span>  </span>
                                {getDate(message.creationTime)[0].split('.')[0]}.{getDate(message.creationTime)[0].split('.')[1]}.
                                {getDate(message.creationTime)[0].split('.')[2]}
                            </span>}
                            {message.attachedFiles?.length !== 0 &&
                                <img src={message.attachedFiles[0].uri} alt="attached file" />
                            }
                            <div className={'message_change_container'}>
                                {role === 'admin' &&
                                    <button
                                        value={message.id}
                                        onClick={() => {
                                            setMessageToDelete(message.id);
                                            setVisibleWindow(true);
                                        }}
                                        disabled={loadingDelete[message.id]}
                                        className={chat.uid === message.uid ? 'user_default_button_delete default_button_delete' : 'default_button_delete '}
                                    >
                                        Удалить
                                    </button>
                                }
                                {chat.uid !== message.uid &&
                                    <span className={'status_message'}>{message.read ? 'Просмотрено' : 'Доставлено'}</span>
                                }
                                {index === chat.messages.length - 1 && chat.uid === message.uid &&
                                    <span className={'yellow'}>Нет ответа</span>
                                }
                            </div>
                        </div>
                    )}
                    {statusSendMessage === 'loading' && temporaryMessage &&
                        <div className={'manager_message message'}>
                            <h4>{manager.name}</h4>
                            <p style={{ paddingLeft: '10px' }}>{temporaryMessage}</p>
                            <span className={'status_message'}>Отправка...</span>
                        </div>
                    }
                    {statusSendMessage === 'failed' &&
                        <div className={'manager_message message error'}>
                            <span className={'status_message'}>Что-то пошло не так :(</span>
                        </div>}
                    <div ref={messagesEndRef} />
                </div>
                : <div className={'chat_messages_container'}>
                    <h3 style={{ alignSelf: 'center' }}>Сообщений пока нет</h3>
                </div>
            }
            {(manager.role === 'admin' || manager.chatManagement) &&
                <button
                    onClick={confirmDeleteChat}
                    className={'default_button_delete'}>
                    Удалить чат
                </button>
            }
            <InputMessage chat_id={chat?.id} uid={chat?.uid} />
            {visibleWindow && <ShadowWindow
                text={`Вы уверены, что хотите удалить сообщение ${chat.messages.find( message => message.id === messageToDelete)?.text}?`}
                onClose={() => setVisibleWindow(false)}
                deleteFunc={() => {
                    if (messageToDelete) {
                        deleteMessage(messageToDelete);
                    }

                }}
                status={loadingDelete[messageToDelete as string] ? 'loading' : ''}
            />}
            {visibleChatDeleteWindow && <ShadowWindow
                text={`Вы уверены, что хотите удалить этот чат?`}
                onClose={() => setVisibleChatDeleteWindow(false)}
                deleteFunc={() => {
                    deleteChat();
                }}
                status={statusDeleteChat}
            />}
        </div>
    );
};

export default DetailedChatItem;

