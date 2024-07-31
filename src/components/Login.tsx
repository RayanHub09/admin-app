import React, {useState} from 'react';
import Form from "./Form";
import {signIn} from "../store/slices/worker";
import {useAppDispatch} from "../hooks/redux-hooks";
import {useNavigate} from "react-router-dom";


const Login = () => {
    const dispatch = useAppDispatch()
    const navigation = useNavigate()
    const [error, setError] = useState('')

    function loginWorker(email : string, password : string) {
            dispatch(signIn({email, password}))
                .then(() => navigation('/'))
                .catch(() => setError('Неправильный пароль/email. Проверьте и попробуйте снова.'))

    }
    return (
        <>
        <Form
            text_button={'Войти'}
            handleClick={loginWorker}
        />
            {error && <span className={'error'}>{error}</span>}
        </>
    );
};

export default Login;