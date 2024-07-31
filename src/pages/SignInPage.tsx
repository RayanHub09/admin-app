import React from 'react';
import './pages.sass'
import Login from "../components/login/Login";

const SignInPage = () => {
    return (
        <div className={'signin_container'}>
            <h1>Авторизация</h1>
            <Login />
        </div>
    );
};

export default SignInPage;