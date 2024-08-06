import React, {FC} from 'react';
import {Link} from "react-router-dom";
import {IRole, options} from "../../lists/roleList";
import {IManager} from "../../interfaces";


interface ManagerItemProps {
    manager: IManager;
}

const ManagerItem: FC<ManagerItemProps> = ({manager}) => {
    return manager &&
        <Link to={`/managers/${manager.id}`} className={'link_item'}>
        <div className={'manager_item'}>
            <span>{manager.id}</span>
            <h4>{manager.name}</h4>
            <span>Отдел: {options[manager.role as keyof IRole]}</span>
        </div>
    </Link>
};

export default ManagerItem;