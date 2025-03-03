import React, { useEffect, useState } from 'react';
import { useAppSelector } from "../../hooks/redux-hooks";
import { IRole, options } from "../../lists/roleList";
import ChatItem from "./ChatItem";
import { useLocation } from "react-router-dom";
import './messages.sass';
import { IChat } from "../../interfaces";

const SectionMessages = () => {
    const chats = useAppSelector(state => state.messages.chats);
    const section = useLocation().pathname.split('/')[2];
    const [sortValue, setSortValue] = useState('asc');
    const [sortedChats, setSortedChats] = useState<IChat[]>([]);

    useEffect(() => {
        const filteredChats = chats.filter(chat => options[section as keyof IRole] === chat.department);
        setSortedChats(filteredChats);
        setSortValue('asc')
        setSortedChats(prevChats => {
            return filteredChats.sort((a: IChat, b: IChat) => {
                const hasMessagesA = a?.messages && Array.isArray(a.messages) && a.messages.length > 0;
                const hasMessagesB = b?.messages && Array.isArray(b.messages) && b.messages.length > 0;
                const dateA = hasMessagesA ? +(a.messages[a.messages.length - 1]?.creationTime) : +(new Date(a.creationDate))
                const dateB = hasMessagesB ? +(b.messages[b.messages.length - 1]?.creationTime) : +(new Date(b.creationDate))
                return sortValue === "asc" ? +dateB - +dateA : +dateA - +dateB;
            });
        })
    }, [chats, section]);

    useEffect(() => {
        const filteredChats = chats.filter(chat => options[section as keyof IRole] === chat.department);
        setSortedChats(prevChats => {
            return filteredChats.sort((a: IChat, b: IChat) => {
                const hasMessagesA = a?.messages && Array.isArray(a.messages) && a.messages.length > 0;
                const hasMessagesB = b?.messages && Array.isArray(b.messages) && b.messages.length > 0;
                const dateA = hasMessagesA ? +(a.messages[a.messages.length - 1]?.creationTime) : +(new Date(a.creationDate))
                const dateB = hasMessagesB ? +(b.messages[b.messages.length - 1]?.creationTime) : +(new Date(b.creationDate))
                return sortValue === "asc" ? +dateB - +dateA : +dateA - +dateB;
            });
        });
    }, [sortValue])

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSortValue = event.target.value;
        setSortValue(newSortValue);
    };

    return (
        <div className={'chat_list_container'}>
            <div style={{ paddingBottom: '10px' }} className={'sort_container'}>
                <select className={'fields_sort'} onChange={handleSortChange} value={sortValue}>
                    <option value="asc">Сначала новые</option>
                    <option value="desc">Сначала старые</option>
                </select>
            </div>
            {sortedChats.length > 0 ? (
                sortedChats.map(chat => (
                    <ChatItem key={chat.id} chat={chat} />
                ))
            ) : (
                <div className="no_chats_message">
                    Пока нет подходящих чатов.
                </div>
            )}
        </div>
    );
};

export default SectionMessages;
