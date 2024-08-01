import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import ManagerItem from "./ManagerItem";
import {fetchGetAllManagers} from "../../store/slices/managers";

interface IManager {
    id: string | null
    email: string | null
    role: string | null
}

const ManagersList = () => {
    const managers:IManager[] = useAppSelector(state => state.managers.managers)

    return (
        <div className={'managers_list_container'}>
            <h1>Менеджеры</h1>
            <div className={'managers_list'}>
                {managers.map((item) => (
                    <ManagerItem
                        key={item.id}
                        manager={item}/>
                ))}
            </div>
        </div>
    );
};

export default ManagersList;