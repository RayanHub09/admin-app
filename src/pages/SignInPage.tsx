import React from 'react';
import './pages.sass'
import Login from "../components/login/Login";
import {useAppSelector} from "../hooks/redux-hooks";
import Loading from '../components/Loading';

const SignInPage = () => {
    const status = useAppSelector(state => state.manager.status)
    return (
        <div className={'container'}>
            {status === 'loading' &&
                <Loading />
            }
            {status === 'failed' || status === null &&
                <div className={'signin_page_container'}>
                    <h1>Авторизация</h1>
                    <Login />
                </div>
            }
        </div>

    );
};

export default SignInPage;