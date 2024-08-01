import React, {FC} from 'react';
import {Link} from "react-router-dom";

interface IManager {
    id: string | null
    email: string | null
    role: string | null
}
interface ManagerItemProps {
    manager: IManager;
}

const ManagerItem:FC<ManagerItemProps> = ({manager}) => {
    return (
        <div className={'manager_item'}>
            <h4>Email: {manager.email}</h4>
            <span>Роль: {manager.role}</span>
            <Link to={`/managers/${manager.id}`}>View Details</Link>
        </div>
    );
};

export default ManagerItem;