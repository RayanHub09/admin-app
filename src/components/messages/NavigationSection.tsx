import React, {FC, useState} from 'react';
import {IRole, options} from "../../lists/roleList";
import {Link, useLocation} from "react-router-dom";
import {IMessage} from "../../interfaces";
import {useAppSelector} from "../../hooks/redux-hooks";

interface NavigationSectionProps {
    option: string
}

const NavigationSection: FC<NavigationSectionProps> = ({option}) => {
    const [section, setSection] = useState('accounting')
    const location = useLocation()
    const manager = useAppSelector(state => state.manager.manager)
    const chats = useAppSelector(state => state.messages.chats)
    const unreadMessagesCount = chats.reduce((count, chat) => {
        if (chat.department === options[option as keyof IRole]) {
            const unreadInChat = chat.messages.filter((message: IMessage) => {
                return message?.uid !== manager.id && !message?.read;
            }).length;
            return count + unreadInChat;
        }
        return count;
    }, 0)
    const count_unanswered_messages = useAppSelector(state =>
        state.messages.chats).filter(chat =>
            chat.messages[chat.messages.length -1 ].uid !== manager.id
            && chat.department === options[option as keyof IRole]

        ).length

    function showSection(key: string): void {
        setSection(key)

    }

    return (
        <Link
            onClick={event => {
                showSection(option)
                console.log(location.pathname.split('/')[2])
            }}
            className={location.pathname.split('/')[2] === option ? 'active_section_messages' : 'section_messages'}
            key={option}
            to={`/messages/${option}`} >
            <div className={'notifications_container'}>
                {options[option as keyof IRole]}
                {unreadMessagesCount !== 0 && <span style={{alignSelf: 'flex-start'}} className={'red_notifications'}>{unreadMessagesCount}</span>}
                {count_unanswered_messages - unreadMessagesCount > 0 && <span  className={'yellow_notifications'}>{count_unanswered_messages - unreadMessagesCount}</span>}

            </div></Link>

    );
};

export default NavigationSection;