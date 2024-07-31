import React from 'react';
import './components.sass'
import {useAppDispatch} from "../hooks/redux-hooks";
import {useAuth} from "../hooks/use-auth";
import {removeWorker} from "../store/slices/worker";
const Header = () => {
    const dispatch = useAppDispatch()
    const {isAuth, email} = useAuth()
    return (
        <header>
            <h2>{email}</h2>
            <button
                className={'button_out'}
                onClick={() => dispatch(removeWorker())}
            >Выйти</button>
        </header>
    );
};

export default Header;