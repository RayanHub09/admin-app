import React, {FC, useEffect} from 'react';
import {Link} from "react-router-dom";
import {IRole, options} from "../../lists/roleList";
import {IManager} from "../../interfaces";
import {collection, db, onSnapshot} from "../../firebase";


interface ManagerItemProps {
    manager: IManager;
}

const ManagerItem: FC<ManagerItemProps> = ({manager}) => {

    useEffect(() =>
        {
            const unsubscribe = onSnapshot(collection(db, "managers"),(snapshot) => {
                console.log(snapshot.size)
            })
            return () => unsubscribe();
        }
    )
    return manager &&
        <Link to={`/managers/${manager.id}`} className={'link_item'} style={{textDecoration: "none", color: 'black'}}>
        <div className={'manager_item'} >
            <h4>{manager.name}</h4>
            <span>Отдел: {options[manager.role as keyof IRole]}</span>
        </div>
    </Link>
};

export default ManagerItem;