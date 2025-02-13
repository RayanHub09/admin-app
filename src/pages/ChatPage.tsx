import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {IChat} from "../interfaces";
import {useAppSelector} from "../hooks/redux-hooks";
import DetailedChatItem from "../components/messages/DetailedChatItem";
import NotFoundPage from "./NotFoundPage";


const ChatPage = () => {
    const navigation = useNavigate();
    const { id } = useParams<{ id: string }>()
    const chat: IChat | undefined = useAppSelector(state =>
        state.messages.chats.find(chat => chat.id === id))

    useEffect(() => {
        if (!chat) {
            navigation('/messages')
        }
    }, [chat])

    if (!chat) {
        return <NotFoundPage />
    }



    return (
        <div className={'chat_page_container'}>
            <DetailedChatItem
                key={chat.id}
                chat={chat as IChat} />
        </div>
    );
};

export default ChatPage;