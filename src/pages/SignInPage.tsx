import React from 'react';
import './pages.sass'
import Login from "../components/Login";

const SignInPage = () => {
    return (
        <div className={'sinin_container'}>
            <h1>Авторизация</h1>
            <Login />
        </div>
    );
};

export default SignInPage;