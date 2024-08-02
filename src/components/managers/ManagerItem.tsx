import React, {FC} from 'react';
import {Link} from "react-router-dom";
import {IRole, options} from "./roleList";
import {IManager} from "../../interfaces";


interface ManagerItemProps {
    manager: IManager;
}

const ManagerItem: FC<ManagerItemProps> = ({manager}) => {
    return (
        <Link to={`/managers/${manager.id}`} className={'link_item'}>
            <div className={'manager_item'}>
                <h4>{manager.name}</h4>
                <span>Отдел: {options[manager.role as keyof IRole]}</span>
            </div>
        </Link>
    );
};

export default ManagerItem;