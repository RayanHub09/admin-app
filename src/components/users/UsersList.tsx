import React from 'react';
import './users.sass';
import {useAppSelector} from "../../hooks/redux-hooks";
import SearchUser from "./SearchUser";
import UserItem from "./UserItem";
import NotFoundText from "../NotFoundText";

const UsersList = () => {
    // Получаем состояние пользователей и флаг поиска из Redux
    const users = useAppSelector(state => state.users.users);
    const isSearching = useAppSelector(state => state.users.isSearching);
    const filteredUsers = useAppSelector(state => state.users.filteredUsers);

    return (
        <div className={'users_list_container'}>
            <div className={(filteredUsers.length === 0 && isSearching) ? 'users_list_filtered' :'users_list'}>
                {(filteredUsers.length === 0 && isSearching) ? (<NotFoundText />) :
                    <>
                        <span
                            style={{borderLeft: '1px rgba(128, 128, 128, 0.5) solid'}}
                            className={'label_user'}>Имя</span>
                        <span
                            className={'label_user'}>Фамилия</span>
                        <span
                            className={'label_user'}>Отчество</span>
                        <span
                            className={'label_user'}>Email</span>
                        <span
                            className={'label_user'}>Номер телефона</span>
                        {isSearching ?
                            filteredUsers.map(user =>
                                <UserItem user={user} key={user.id}/>
                            ) :
                            users.map(user =>
                                <UserItem user={user} key={user.id}/>)
                        }
                    </>

                }
            </div>
        </div>
    );
};

export default UsersList;
