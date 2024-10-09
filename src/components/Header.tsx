import React, {useEffect} from 'react';
import './components.sass'
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {removeManager} from "../store/slices/manager";
import NavBar from "./NavBar";
import {useNavigate} from "react-router-dom";

const signOut = require('../image/signOut.png')

const Header = () => {
    const dispatch = useAppDispatch()
    const loading = useAppSelector(state => state.manager.status)
    const isAuth = useAppSelector(state => state.manager.isAuth)
    const worker = useAppSelector(state => state.manager.manager)
    const navigation = useNavigate()

    return (
        <header>
            <h2>{worker.email}</h2>
            {loading === 'succeeded' && isAuth && <NavBar/>}
            {isAuth && loading === 'succeeded' &&
               <img
                    className={'button_out'}
                    onClick={() => dispatch(removeManager())}
                    title={'Выйти'}
                    src={signOut}
                    alt={'Выйти'}/>
            }
        </header>
    );
};

export default Header;