import React, {useState} from 'react';
import './managers.sass'
import Form from "../Form";
import {useAppDispatch} from "../../hooks/redux-hooks";
import {fetchSignUpManager} from "../../store/slices/managers";

const CreateManagers = () => {
    const dispatch = useAppDispatch()
    const [additionForm, setAdditionForm] = useState(false)

    function createWorker(email: string, password: string, role?: string) {
        if (role) dispatch(fetchSignUpManager({email, password, role}))
        setAdditionForm(!additionForm)

    }

    return (
        <>
            <button className={'add_workers_button'} onClick={() => setAdditionForm(!additionForm)}>{
                !additionForm ? 'Добавить менеджера' : 'Закрыть'
            }</button>
            {
                <div className={additionForm ? 'add_form_container' : 'hidden_add_form_container'}>
                    <Form
                        text_button={'Добавить'}
                        isCreate={true}
                        handleClick={createWorker}/>
                </div>}
        </>
    );
};

export default CreateManagers;