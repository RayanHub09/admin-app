import React, {FC, useEffect, useState} from 'react';
import {IRole, options} from "../../lists/roleList";
import {fetchCreateChat, fetchGetAllChats} from "../../store/slices/messages";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {useNavigate} from "react-router-dom";

interface PropsCreateChatForm {
    uid: string
}

const CreateChatForm:FC<PropsCreateChatForm> = ({uid}) => {
    const [role, setRole] = useState<string | undefined>('Выберете отдел')
    const [theme, setTheme] = useState('')
    const dispatch = useAppDispatch()
    const navigation = useNavigate()
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const status = useAppSelector(state => state.messages.statusCreateChat)
    const statusGet = useAppSelector(state => state.messages.statusGetMessage)

    function createChat() {
        if (theme?.length === 0 || role?.length === 0 || role === 'Выберете отдел') {
            setError('Заполните все поля');
            setTimeout(() => setError(''), 2000);
        } else {
            dispatch(fetchCreateChat({ uid: uid, theme: theme, department: options[role as keyof IRole] }))
                .then((resultAction) => {
                    if (fetchCreateChat.fulfilled.match(resultAction)) {
                        const newChatId = resultAction.payload
                        navigation(`/messages/${role}/${newChatId}`)

                    } else {
                        setError('Не удалось создать чат.')
                    }
                })
                .then(() => dispatch(fetchGetAllChats()))
                .catch((error) => {
                    setError(error.message)
                });
        }
    }


    useEffect(() => {
        setRole('Выберете отдел')
        setTheme('')
    }, [])

    return (
        <div className={'create_chat_form'}>
            <h2 style={{alignSelf: 'center'}}>Создание чата</h2>
            <input
                value={theme}
                onChange={event => setTheme(event.target.value)}
                placeholder={'Тема чата'}
            />

            <select
                value={role}
                onChange={event => setRole(event.target.value)}
                >
                <option disabled={true}>Выберете отдел</option>
                {Object.keys(options).map((key, index) =>
                    <option value={key} key={index}>{options[key as keyof IRole]}</option>
                )}
            </select>
            {error && <span
                style={{alignSelf: 'center'}}
                className={'error'}>{error}</span>}
            <button
                className={'default_button'}
                onClick={createChat}
            >{status === 'loading' ? 'Создание...' : 'Создать'}</button>
        </div>
    );
};

export default CreateChatForm;