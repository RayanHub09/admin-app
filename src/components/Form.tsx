import React, {FC, useEffect, useState} from 'react';
import './components.sass';
import {options, IRole} from "../lists/roleList";
import {possibilitiesManager, IPossibilitiesManager} from "../lists/possibilitiesManagerList";
import {generatePassword} from "../functions/generatePassword";
import {useAppDispatch} from "../hooks/redux-hooks";
import {removeManager} from "../store/slices/manager";

interface FormProps {
    text_button: string,
    isCreate: boolean,
    handleClick: (email: string, password: string, role?: string | undefined, name?: string | undefined,
                  checkboxes?: { [key: string]: boolean }) => void;
}

const Form: FC<FormProps> = ({text_button, handleClick, isCreate}) => {
    const [password, setPassword] = useState('');
    const [checkboxStates, setCheckboxStates] = useState(
        Object.keys(possibilitiesManager).reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {} as { [key: string]: boolean })
    );
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<string>('Выберете отдел'); // Изменено здесь
    const [visibilityPassword, setVisibilityPassword] = useState(false);
    const dispatch = useAppDispatch()
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {id, checked} = event.target;
        setCheckboxStates((prevState) => ({...prevState, [id]: checked}));
    };

    function clickFunction() {
        handleClick(email, password, role === 'Выберете отдел' ? undefined : role, name, {...checkboxStates});
    }

    useEffect(() => {
        setRole('Выберете отдел');
        setEmail('');
        setPassword('');
        setName('');
    }, []);

    return (
        <div className={!isCreate ? 'form_signin' : 'form_create_manager'}>
            {isCreate &&
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
            {!isCreate &&
                <input
                    placeholder={'Введите пароль'}
                    type={visibilityPassword || isCreate ? 'text' : 'password'}
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    // onChange={() => dispatch(removeManager())}
                />
            }
            {isCreate && (password === '' ?
                    <button
                        onClick={() => setPassword(generatePassword(10))}
                        style={{border: '1px black solid', borderRadius: '0px'}}
                        className={'button_generate'}
                    >
                        Сгенерировать пароль
                    </button>
                    :
                    <input
                        placeholder={'Введите пароль'}
                        type={visibilityPassword || isCreate ? 'text' : 'password'}
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                    />
            )}
            {isCreate &&
                <select value={role} onChange={event => setRole(event.target.value)}>
                    <option value="Выберете отдел" disabled={true}>Выберете отдел</option>
                    {/* Значение по умолчанию */}
                    {Object.keys(options).map((key, index) => (
                        <option value={key} key={index}>{options[key as keyof IRole]}</option>
                    ))}
                </select>
            }
            {isCreate && (
                <div className={'possibilities_manager_container'}>
                    {Object.keys(possibilitiesManager).map((key) => (
                        <div className={'checkbox_input'} key={key}>
                            <input
                                type={'checkbox'}
                                id={key}
                                checked={checkboxStates[key]}
                                onChange={event => handleCheckboxChange(event)}
                            />
                            <label
                                style={{paddingBottom: '5px'}}>{possibilitiesManager[key as keyof IPossibilitiesManager]}</label>
                        </div>
                    ))}
                </div>
            )}
            {!isCreate &&
                <span className={'visibility_password'}>
                    <label>Показать пароль</label>
                    <input
                        type={"checkbox"}
                        checked={visibilityPassword}
                        onChange={() => setVisibilityPassword(!visibilityPassword)}
                    />
                </span>
            }
            <button className={'default_button'} onClick={clickFunction}>
                {text_button}
            </button>
        </div>
    );
};

export default Form;
