import React, {useEffect} from 'react';
import NavigationSections from "../components/messages/NavigationSections";
import SectionMessages from "../components/messages/SectionMessages";

const MessagesPage = () => {

    return (
        <div className={'messages_page_container'}>
            <NavigationSections />
            <SectionMessages  />
        </div>
    );
};

export default MessagesPage;