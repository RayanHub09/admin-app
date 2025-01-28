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
    }, [chats, section]);

    useEffect(() => {
        handleSortChange(sortValue);
    }, [sortValue]);

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement> | string) => {
        if (typeof event === 'string') {
            setSortValue(event)
        } else {
            const value = event.target.value;
            setSortValue(value);
        }
        setSortedChats(prevChats => {
            const sorted = [...prevChats];
            return sorted.sort((a, b) => {
                const dateA = a.messages.length > 0 ? +new Date(a.messages[a.messages.length - 1]?.creationTime) : 0;
                const dateB = b.messages.length > 0 ? +new Date(b.messages[b.messages.length - 1]?.creationTime) : 0;

                return sortValue !== "desc" ? dateB - dateA : dateA - dateB;
            });
        });
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
