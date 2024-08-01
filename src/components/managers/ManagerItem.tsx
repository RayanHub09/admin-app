import React, {FC} from 'react';
import {Link} from "react-router-dom";
import {IRole, options} from "./roleList";

interface IManager {
    id: string | null
    email: string | null
    role: string | null
}

interface ManagerItemProps {
    manager: IManager;
}

const ManagerItem: FC<ManagerItemProps> = ({manager}) => {
    return (
        <Link to={`/managers/${manager.id}`} className={'link_item'}>
            <div className={'manager_item'}>
                <h4>Email: {manager.email}</h4>
                <span>Роль: {options[manager.role as keyof IRole]}</span>
            </div>
        </Link>
    );
};

export default ManagerItem;