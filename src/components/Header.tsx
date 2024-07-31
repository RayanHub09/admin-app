import React from 'react';
import './components.sass'
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";

import {removeWorker} from "../store/slices/worker";
import NavBar from "./NavBar";
const Header = () => {
    const dispatch = useAppDispatch()
    const worker = useAppSelector(state => state.worker.worker)
    return (
        <header>
            <h2>{worker.email}/</h2>
            <span>{worker.role}</span>
            <NavBar />
            <button
                className={'button_out'}
                onClick={() => dispatch(removeWorker())}
            >Выйти</button>
        </header>
    );
};

export default Header;