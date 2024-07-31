import React, {FC, useState} from 'react';
import './components.sass'

interface FormProps {
    text_button: string,
    isCreate: boolean
    handleClick: (email: string, password: string) => void;
}
interface ISelect {
    spare_parts : string,
    yahoo_auctions: string,
    parcels : string,
    accounting : string
}

const Form: FC<FormProps> = ({text_button, handleClick, isCreate}) => {
    const options: ISelect = {
        spare_parts: 'Запчасти',
        yahoo_auctions: 'Yahoo аукционы',
        parcels: 'Посылки',
        accounting: 'Бухгалтерия'
    }
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('Выберете роль')
    const [visibilityPassword, setVisibilityPassword] = useState(false)

    return (
        <div className={'form'}>
            <input
                placeholder={'Введите email'}
                type={'email'}
                value={email}
                onChange={event => setEmail(event.target.value)}
            />
            <input
                placeholder={'Введите пароль'}
                type={visibilityPassword || isCreate ? 'email' : 'password'}
                value={password}
                onChange={event => setPassword(event.target.value)}
            />
            { isCreate &&
                <select
                    value={role}
                    onChange={event => setRole(event.target.value)}
                    className={'choose_role'}>
                    <option disabled={true}>Выберете роль</option>
                    {Object.keys(options).map(key =>
                        <option value={key}>{options[key as keyof ISelect]}</option>
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
                onClick={() => handleClick(email, password)}
            >
                {text_button}
            </button>
        </div>
    );
};
// bul@mail.ru
// 1234457
export default Form;