import React, {useEffect} from 'react';
import NavigationSection from "../components/messages/NavigationSection";
import SectionMessages from "../components/messages/SectionMessages";
import {collection, onSnapshot} from "firebase/firestore";
import {db} from "../firebase";
import {IMessage} from "../interfaces";

const MessagesPage = () => {

    // useEffect(() => {
    //     const chatsRef = collection(db, 'chat_rooms')
    //     const unsubscribe = onSnapshot(chatsRef, (querySnapshot) => {
    //         const messages: IMessage[] = [];
    //         querySnapshot.forEach((doc) => {
    //             messages.push(doc.data() as IMessage);
    //         });
    //         console.log(messages)
    //     });
    // }, []);
    return (
        <div className={'messages_page_container'}>
            <NavigationSection />
            <SectionMessages  />
        </div>
    );
};

export default MessagesPage;