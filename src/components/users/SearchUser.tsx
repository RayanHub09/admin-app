import React, {useCallback, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {clearSearch} from "../../store/slices/users";
import {searchUser} from "../../store/slices/users";

const SearchUser = () => {
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [patronymic, setPatronymic] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const isSearching = useAppSelector(state => state.users.isSearching)
    const dispatch = useAppDispatch()

    const searchClearFields = useCallback(() => {
        setName('')
        setSurname('')
        setPatronymic('')
        setPhoneNumber('')
        setEmail('')
        dispatch(clearSearch())
    }, [dispatch])

    const searchUserItem = useCallback(() => {
        dispatch(searchUser([name, surname, patronymic, phoneNumber, email]))
    }, [dispatch, name, surname, phoneNumber, email, patronymic])

    return (
        <div className={'search_users_container'}>
            <div className={'fields_search_container'}>
                <div className={'field_search'}>
                    <label className={'label_search'}>Имя</label>
                    <input
                        value={name}
                        onChange={event => setName(event.target.value)}
                    />
                </div>

                <div className={'field_search'}>
                    <label className={'label_search'}>Фамилия</label>
                    <input
                        value={surname}
                        onChange={event => setSurname(event.target.value)}
                    />
                </div>

                <div className={'field_search'}>
                    <label className={'label_search'}>Отчество</label>
                    <input
                        value={patronymic}
                        onChange={event => setPatronymic(event.target.value)}
                    />
                </div>

                <div className={'field_search'}>
                    <label className={'label_search'}>Email</label>
                    <input
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                    />
                </div>

                <div className={'field_search'}>
                    <label className={'label_search'}>Номер телефона</label>
                    <input
                        value={phoneNumber}
                        onChange={event => setPhoneNumber(event.target.value)}
                    />
                </div>
            </div>
            <div className={'buttons_change_container'} style={{justifyContent: "center"}}>
                <button
                    onClick={searchUserItem}
                    className={'change_button'} >Найти</button>
                <button
                    onClick={searchClearFields}
                    className={'change_button'}>Сбросить</button>
            </div>
        </div>
    );
};

export default SearchUser;