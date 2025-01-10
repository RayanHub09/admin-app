import React, {FC, useState} from 'react';
import {IUser} from "../../interfaces";
import {Link} from "react-router-dom";

interface UserItemProps {
    user: IUser
}

const UserItem:FC<UserItemProps> = ({user}) => {
    const [isOnMouseEnter, setIsOnMouseEnter] = useState(false)
    return (
        <>
            <Link
                onMouseEnter={() => setIsOnMouseEnter(true)}
                onMouseLeave={() => setIsOnMouseEnter(false)}
                className={!isOnMouseEnter ? 'field_link' : 'field_link_chosen'}
                style={{borderLeft: '1px rgba(128, 128, 128, 0.5) solid'}}
                to={`/users/${user.id}`}>
                <span>{user.name}</span>
            </Link>
            <Link
                onMouseEnter={() => setIsOnMouseEnter(true)}
                onMouseLeave={() => setIsOnMouseEnter(false)}
                className={!isOnMouseEnter ? 'field_link' : 'field_link_chosen'}
                to={`/users/${user.id}`}>
                <span >{user.surname}</span>
            </Link>
            <Link
                onMouseEnter={() => setIsOnMouseEnter(true)}
                onMouseLeave={() => setIsOnMouseEnter(false)}
                className={!isOnMouseEnter ? 'field_link' : 'field_link_chosen'}
                style={{borderLeft: '1px rgba(128, 128, 128, 0.5) solid'}}
                to={`/users/${user.id}`}>
                <span>{user.patronymic}</span>
            </Link>
            <Link
                onMouseEnter={() => setIsOnMouseEnter(true)}
                onMouseLeave={() => setIsOnMouseEnter(false)}
                className={!isOnMouseEnter ? 'field_link' : 'field_link_chosen'}
                to={`/users/${user.id}`}>
                <span >{user.email}</span>
            </Link>
            <Link
                onMouseEnter={() => setIsOnMouseEnter(true)}
                onMouseLeave={() => setIsOnMouseEnter(false)}
                className={!isOnMouseEnter ? 'field_link' : 'field_link_chosen'}
                to={`/users/${user.id}`}>
                <span >{user.phoneNumber}</span>
            </Link>
        </>
    );
};

export default UserItem;