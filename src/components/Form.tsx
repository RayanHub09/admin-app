import React, {FC, useState} from 'react';
import './components.sass'

interface FormProps {
    text_button: string,
    handleClick: (email: string, password: string) => void;
}

const Form: FC<FormProps> = ({text_button, handleClick}) => {
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [visibilityPassword, setVisibilityPassword] = useState(false)
    // function
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
                type={visibilityPassword ? 'email' : 'password'}
                value={password}
                onChange={event => setPassword(event.target.value)}
            />
            <span className={'visibility_password'}>
                    <label>Показать пароль</label>
                    <input
                        type={"checkbox"}
                        checked={visibilityPassword}
                        onChange={() => setVisibilityPassword(!visibilityPassword)}
                    />
            </span>
            <button
                className={'default_button'}
                // disabled={true}
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