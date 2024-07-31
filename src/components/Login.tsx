import React, {useState} from 'react';
import Form from "./Form";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import {setWorker} from "../store/slices/worker";
import {useAppDispatch} from "../hooks/redux-hooks";
import {useNavigate} from "react-router-dom";


const Login = () => {
    const dispatch = useAppDispatch()
    const navigation = useNavigate()
    const [error, setError] = useState('')

    function loginWorker(email : string, password : string) {
        const auth = getAuth()
        signInWithEmailAndPassword(auth, email, password)
            .then(({user}) => {
                dispatch(setWorker({
                    email: user.email,
                    id: user.uid,
                    token: user.refreshToken
                }))
                console.log(user.refreshToken)
            })
            .then()
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