import React, {useEffect} from 'react';
import Form from "../Form";
import {fetchAutoSignIn, fetchSignIn} from "../../store/slices/manager";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {useNavigate} from "react-router-dom";


const Login = () => {
    const dispatch = useAppDispatch()
    const navigation = useNavigate()
    const error = useAppSelector(state => state.manager.error)
    const token = useAppSelector(state => state.manager.token)

    const loginWorker = (email: string, password: string) => {
        dispatch(fetchSignIn({ email, password }))
            .then(() =>  navigation('/orders'))
    }

    return (
        <>
        <Form
            text_button={'Войти'}
            handleClick={loginWorker}
            isCreate={false}
        />
            {error && <span className={'error'}>Неправильный email/пароль. Проверьте и попробуйте снова.</span>}
        </>
    );
};

export default Login;