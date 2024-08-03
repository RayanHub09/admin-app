import React, {useEffect} from 'react';
import './components.sass'
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";

import {removeManager} from "../store/slices/manager";
import NavBar from "./NavBar";
import {useNavigate} from "react-router-dom";

const Header = () => {
    const dispatch = useAppDispatch()
    const isAuth = useAppSelector(state => state.manager.isAuth)
    const worker = useAppSelector(state => state.manager.manager)
    const navigation = useNavigate()

    // useEffect(() => {console.log(0)})
    return (
        <header>

            <h2>{worker.email}</h2>
            {isAuth && <NavBar/>}
            {isAuth &&
                <button
                    className={'button_out'}
                    onClick={() => dispatch(removeManager())}
                >Выйти</button>
            }

        </header>
    );
};

export default Header;