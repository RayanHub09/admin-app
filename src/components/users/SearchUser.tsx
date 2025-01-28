import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { clearSearch } from "../../store/slices/users";
import { searchUser  } from "../../store/slices/users";

const SearchUser  = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [patronymic, setPatronymic] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const dispatch = useAppDispatch();
    const nameInputRef = useRef<HTMLInputElement>(null);

    const searchClearFields = useCallback(() => {
        setName('');
        setSurname('');
        setPatronymic('');
        setPhoneNumber('');
        setEmail('');
        dispatch(clearSearch());
    }, [dispatch]);

    const handleSearchUser  = useCallback(() => {
        dispatch(searchUser ([name, surname, patronymic, phoneNumber, email]));
    }, [dispatch, name, surname, patronymic, phoneNumber, email]);

    useEffect(() => {
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSearchUser ();
        }
    };

    return (
        <div className={'search_users_container'} onKeyDown={handleKeyDown}>
            <div className={'fields_search_container'}>
                <div className={'field_search'}>
                    <label className={'label_search'}>Имя</label>
                    <input
                        ref={nameInputRef}
                        value={name}
                        onChange={event => setName(event.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div className={'field_search'}>
                    <label className={'label_search'}>Фамилия</label>
                    <input
                        value={surname}
                        onChange={event => setSurname(event.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div className={'field_search'}>
                    <label className={'label_search'}>Отчество</label>
                    <input
                        value={patronymic}
                        onChange={event => setPatronymic(event.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div className={'field_search'}>
                    <label className={'label_search'}>Email</label>
                    <input
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div className={'field_search'}>
                    <label className={'label_search'}>Номер телефона</label>
                    <input
                        value={phoneNumber}
                        onChange={event => setPhoneNumber(event.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </div>
            <div className={'buttons_change_container'} style={{ justifyContent: "center" }}>
                <button
                    onClick={handleSearchUser }
                    className={'change_button'}>Найти</button>
                <button
                    onClick={searchClearFields}
                    className={'change_button'}>Сбросить</button>
            </div>
        </div>
    );
};

export default SearchUser ;