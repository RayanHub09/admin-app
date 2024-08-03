import React, {FC, useState} from 'react';
import './components.sass'
import {options, IRole} from "../lists/roleList";

interface FormProps {
    text_button: string,
    isCreate: boolean
    handleClick: (email: string, password: string, role?: string | undefined) => void;
}


const Form: FC<FormProps> = ({text_button, handleClick, isCreate}) => {

    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [role, setRole] = useState<string|undefined>('Выберете роль')
    const [visibilityPassword, setVisibilityPassword] = useState(false)

    function clickFunction() {
        setRole('Выберете роль')
        setEmail('')
        setPassword('')
        handleClick(email, password, role)
    }

    return (
        <div className={!isCreate ? 'form' : 'form_row'}>
            {
                isCreate &&
                <input
                    value={name}
                    onChange={event => setName(event.target.value)}
                    type={'text'}
                    placeholder={'Введите имя'}
                />
            }
            <input
                placeholder={'Введите email'}
                type={'email'}
                value={email}
                onChange={event => setEmail(event.target.value)}
            />
            <input
                placeholder={'Введите пароль'}
                type={visibilityPassword || isCreate ? 'text' : 'password'}
                value={password}
                onChange={event => setPassword(event.target.value)}
            />
            { isCreate &&
                <select
                    value={role}
                    onChange={event => setRole(event.target.value)}
                    className={'choose_role'}>
                    <option disabled={true}>Выберете роль</option>
                    {Object.keys(options).map((key, index) =>
                        <option value={key} key={index}>{options[key as keyof IRole]}</option>
                    )}
                </select>
            }
            { !isCreate &&
                <span className={'visibility_password'}>
                    <label>Показать пароль</label>
                    <input
                        type={"checkbox"}
                        checked={visibilityPassword}
                        onChange={() => setVisibilityPassword(!visibilityPassword)}
                    />
            </span>
            }
            <button
                className={'default_button'}
                onClick={clickFunction}
            >
                {text_button}
            </button>
        </div>
    );
};
// bul@mail.ru
// 1234457
export default Form;