import React, {useState} from 'react';
import './managers.sass'
import Form from "../Form";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {fetchSignUpManager, setError} from "../../store/slices/managers";

const CreateManagers = () => {
    const dispatch = useAppDispatch()
    const [additionForm, setAdditionForm] = useState(false)
    const status = useAppSelector(state => state.managers.status)

    function createWorker(email: string, password: string, role?: string) {
        if (role) dispatch(fetchSignUpManager({email, password, role}))
        setAdditionForm(!additionForm)

    }

    return (
        <div className={'create_form_container'}>
            <button className={'add_workers_button'} onClick={() => setAdditionForm(!additionForm)}>{
                !additionForm ? 'Добавить менеджера' : 'Закрыть'
            }</button>
            {
                <div className={additionForm ? 'add_form_container' : 'hidden_add_form_container'}>
                    <Form
                        text_button={'Добавить'}
                        isCreate={true}
                        handleClick={createWorker}/>
                </div>
            }
            {status === 'failed' && <p className={'error'}>Произошла ошибка. Пользователь не добавлен.
                <button
                    className={'error_button'}
                    onClick={() => dispatch(setError())}>Закрыть</button>
            </p> }

        </div>
    );
};

export default CreateManagers;