import React from 'react';
import {useAppSelector} from "../../hooks/redux-hooks";
import ManagerItem from "./ManagerItem";
import {IManager} from "../../interfaces";


const ManagersList = () => {
    const managers:IManager[] = useAppSelector(state => state.managers.managers).filter(item => item.role !== 'admin')

    if (managers.length === 0) {
        return <div className={'container'} style={{fontSize: '30px'}}>Пока нет менеджеров</div>
    }

    return (
        <div className={'managers_list_container'}>
            <h1>Менеджеры</h1>
            <div className={'managers_list'}>
                {managers?.map((item) => (
                    <ManagerItem
                        key={item.id}
                        manager={item}/>
                ))}
            </div>
        </div>
    );
};

export default ManagersList;