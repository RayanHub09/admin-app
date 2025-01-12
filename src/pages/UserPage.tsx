import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {useAppSelector} from "../hooks/redux-hooks";
import DetailedUserItem from "../components/users/DetailedUserItem";
import {IUser} from "../interfaces";
import NotFoundPage from "./NotFoundPage";

const UserPage = () => {
    const { id } = useParams<{ id: string }>()
    const user = useAppSelector(state => state.users.users).find(user => user.id === id)

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    if (!user) {
        return <NotFoundPage />
    }
    return (
        <div className={'user_page_container'}>
            <DetailedUserItem user={user as IUser} key={user?.id} />
        </div>
    );
};

export default UserPage;