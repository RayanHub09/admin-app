import React, {useEffect, useState} from 'react';
import Form from "../Form";
import { fetchAutoSignIn, fetchSignIn} from "../../store/slices/manager";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {useNavigate} from "react-router-dom";
import CreateManagers from "../managers/CreateManagers";


const Login = () => {
    const dispatch = useAppDispatch()
    const navigation = useNavigate()
    const [error, setError] = useState(useAppSelector(state => state.manager.error))
    const manager = useAppSelector(state => state.manager)

    const loginWorker = (email: string, password: string) => {
        dispatch(fetchSignIn({ email, password }))
            .then(() =>  navigation('/orders'))
    }

    useEffect(() => {
        setTimeout(() => setError(''), 4000)
        // dispatch(autoSignIn([manager, manager.token]))
    }, [error])

    return (
        <>
        <Form
            text_button={'Войти'}
            handleClick={loginWorker}
            isCreate={false}
        />
            {error && <span className={'error'}>Не удалось войти. Проверьете данные или попробуйте позже.</span>
            }
        </>
    );
};

export default Login;