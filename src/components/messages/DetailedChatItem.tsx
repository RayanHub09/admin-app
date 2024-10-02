import React, {FC, useEffect, useRef} from 'react';
import {IChat, IUser} from "../../interfaces";
import {useAppSelector} from "../../hooks/redux-hooks";
import InputMessage from "./InputMessage";
import 'firebase/database';
import {collection, doc, onSnapshot} from "firebase/firestore";
import {db} from "../../firebase";

interface DetailedChatItemProps {
    chat: IChat
}

const DetailedChatItem: FC<DetailedChatItemProps> = ({chat}) => {
    const manager = useAppSelector(state => state.manager.manager)
    const containerRef = useRef(null)
    const user: IUser | undefined = useAppSelector(state =>
        state.users.users.find(user => user.id === chat.uid))

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({block: 'end', behavior: 'auto'});
        }
    }, [chat.messages]);
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({block: 'end', behavior: 'auto'});
        }
    }, []);


    useEffect(() => {

        const chatsRef = collection(db, 'chat_rooms', chat.id, 'messages')
        const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
            console.log('Chats changed!')
        });
        return unsubscribe;
    }, []);



    return (
        <div className={'detailed_chat_item'}>
            <div className={'chat_messages_container'}>
                {chat?.messages?.map(message =>
                    <div
                        key={message.id}
                        className={chat.uid === message.uid ? 'user_message message' : 'manager_message message'}>
                        {chat.uid === message.uid ? <h4>{user?.name} {user?.surname}</h4> : <h4>{manager.name}</h4>}
                        <p style={{paddingLeft: '10px'}}>{message.text}</p>
                    </div>)}
                <div/>
                <div ref={messagesEndRef}/>
            </div>
            <InputMessage chat_id={chat?.id} uid={chat?.uid}/>
        </div>
    );
};

export default DetailedChatItem;