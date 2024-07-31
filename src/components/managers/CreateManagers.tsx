import React from 'react';
import './managers.sass'
import Form from "../Form";
import {useAppDispatch} from "../../hooks/redux-hooks";
import {fetchCreateWorker} from "../../store/slices/worker";
const CreateManagers = () => {
    const dispatch = useAppDispatch()
    function createWorker(email: string, password: string) {
        dispatch(fetchCreateWorker({email, password}))
    }
    return (
        <div className={'create_workers_container'}>
            <h2>Добавление нового менеджера</h2>
            <Form
                text_button={'Добавить'}
                isCreate={true}
                handleClick={createWorker} />
        </div>
    );
};

export default CreateManagers;