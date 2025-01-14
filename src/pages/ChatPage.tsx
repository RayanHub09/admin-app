import React from 'react';
import {useParams} from "react-router-dom";
import {IChat} from "../interfaces";
import {useAppSelector} from "../hooks/redux-hooks";
import DetailedChatItem from "../components/messages/DetailedChatItem";
import NotFoundPage from "./NotFoundPage";

const ChatPage = () => {
    const { id } = useParams<{ id: string }>()
    const chat: IChat | undefined = useAppSelector(state =>
        state.messages.chats.find(chat => chat.id === id))
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