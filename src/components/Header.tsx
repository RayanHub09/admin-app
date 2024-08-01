import React from 'react';
import './components.sass'
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";

import {removeManager} from "../store/slices/manager";
import NavBar from "./NavBar";
const Header = () => {
    const dispatch = useAppDispatch()
    const worker = useAppSelector(state => state.manager.manager)
    return (
        <header>
            <h2>{worker.email}</h2>
            <NavBar />
            <button
                className={'button_out'}
                onClick={() => dispatch(removeManager())}
            >Выйти</button>
        </header>
    );
};

export default Header;