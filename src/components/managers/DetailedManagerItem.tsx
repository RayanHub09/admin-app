import React, {FC} from 'react';
import {IManager} from "../../interfaces";
import {IRole, options} from "./roleList";

interface DetailedManagerItemProps {
    manager: IManager
}

const DetailedManagerItem:FC<DetailedManagerItemProps> = ({manager}) => {
    return (
        <div className={'manager_item_container'}>
            <h3>{manager.name}</h3>
            <span>Email: {manager.email}</span>
            <span>Отдел: {options[manager.role as keyof IRole]}</span>
        </div>
    );
};

export default DetailedManagerItem;