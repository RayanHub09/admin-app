import React from 'react';
import NavigationSection from "../components/messages/NavigationSection";
import SectionMessages from "../components/messages/SectionMessages";

const MessagesPage = () => {
    return (
        <div className={'messages_page_container'}>
            <NavigationSection />
            <SectionMessages  />
        </div>
    );
};

export default MessagesPage;