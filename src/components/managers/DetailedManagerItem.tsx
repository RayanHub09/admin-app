import React, {FC, useState} from 'react';
import {IManager} from "../../interfaces";
import {IRole, options} from "../../lists/roleList";
import {IPossibilitiesManager, possibilitiesManager} from "../../lists/possibilitiesManagerList";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {fetchChangePossibilitiesManager, fetchDeleteManager} from "../../store/slices/managers";
import {useNavigate} from "react-router-dom";
import ShadowWindow from "../ShadowWindow";
import {fetchAutoSignIn, resetError} from "../../store/slices/manager";

interface DetailedManagerItemProps {
    manager: IManager
}

const DetailedManagerItem: FC<DetailedManagerItemProps> = ({manager}) => {
    const dispatch = useAppDispatch()
    const navigation = useNavigate()
    const status = useAppSelector(state => state.managers.status)
    const [isCreate, setIsCreate] = useState(false)
    const [visibleWindow, setVisibleWindow] = useState(false);
    const statusDeleteManager = useAppSelector(state => state.managers.statusDelete)

    const [checkboxStates, setCheckboxStates] = useState(
        manager ? Object.keys(possibilitiesManager).reduce((acc, key) => {
            acc[key] = !!manager[key]
            return acc
        }, {} as { [key: string]: boolean }) : {}
    )

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsCreate(true)
        const {id, checked} = event.target;
        setCheckboxStates((prevState) => ({...prevState, [id]: checked}));
    }

    function changePossibilitiesManager() {
        if (manager.id) dispatch(fetchChangePossibilitiesManager({managerId: manager.id, checkboxes: checkboxStates}))
    }

    function deleteManager() {
        dispatch(fetchDeleteManager({manager_id: manager.id as string}))
            .then(() => navigation('/managers'))
            .then(() => dispatch(fetchAutoSignIn()))
    }
    if (!manager) {
        navigation('/managers')
    }

    return (
        manager ? (
            <div className={'manager_item_container'}>
                <h3>{manager.name}</h3>
                <span>Email: {manager.email}</span>
                <span>Отдел: {options[manager.role as keyof IRole]}</span>
                <h3>Разрешения для менеджеров:</h3>
                <div className={'possibilities_manager_item_container'}>
                    {Object.keys(possibilitiesManager).map((key, index) => (
                            <div className={'checkbox_input'} key={key}>
                                <input
                                    type={"checkbox"}
                                    id={key}
                                    onChange={event => handleCheckboxChange(event)}
                                    checked={checkboxStates[key]}/>
                                <span
                                    style={{paddingBottom: '5px'}}>{possibilitiesManager[key as keyof IPossibilitiesManager]}</span>
                            </div>
                        )
                    )}
                </div>
                <button
                    disabled={!isCreate || status === 'loading'}
                    onClick={changePossibilitiesManager}
                    className={'change_possibilities_button'}>
                    {status === 'loading' ? 'загрузка...' : 'Сохранить'}
                </button>
                <button
                    className={'error_button'}
                    onClick={() => setVisibleWindow(true)}
                >
                    Удалить менеджера
                </button>
                {visibleWindow &&
                    <ShadowWindow
                        text={`Вы уверены, что хотите удалить менеджера ${manager.name}?`}
                        onClose={() => setVisibleWindow(false)}
                        deleteFunc={deleteManager}
                        status={statusDeleteManager}/>
                }
            </div>
        ) : (
            <h3>not found</h3>
        )
    );

};

export default DetailedManagerItem;