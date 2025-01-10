import React from 'react';
import {useAppSelector} from "../hooks/redux-hooks";
import UsersList from "../components/users/UsersList";
import SearchUser from "../components/users/SearchUser";

const UsersPage = () => {
    return (
        <div className={'users_page_container'}>
            <SearchUser/>
            <UsersList/>
        </div>
    );
};

export default UsersPage;