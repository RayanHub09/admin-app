import React, {FC, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {IRole, options} from "../../lists/roleList";
import {IManager} from "../../interfaces";
import {collection, db, onSnapshot} from "../../firebase";


interface ManagerItemProps {
    manager: IManager;
}

const ManagerItem: FC<ManagerItemProps> = ({manager}) => {
    const [isOnMouseEnter, setIsOnMouseEnter] = useState(false)

    useEffect(() => {
            const unsubscribe = onSnapshot(collection(db, "managers"), (snapshot) => {
                console.log(snapshot.size)
            })
            return () => unsubscribe();
        }
    )
    return manager &&
        <div className={'manager_list_item_container'}>
            {/*<Link to={`/managers/${manager.id}`} className={'link_item'} style={{textDecoration: "none", color: 'black'}}>*/}
            {/*    <div className={'manager_item'}>*/}
            {/*        <h4>{manager.name}</h4>*/}
            {/*        <span>Отдел: {options[manager.role as keyof IRole]}</span>*/}
            {/*    </div>*/}
            {/*</Link>*/}
            <Link
                onMouseEnter={() => setIsOnMouseEnter(true)}
                onMouseLeave={() => setIsOnMouseEnter(false)}
                className={!isOnMouseEnter ? 'field_link' : 'field_link_chosen'}
                style={{borderLeft: '1px rgba(128, 128, 128, 0.5) solid'}}
                to={`/managers/${manager.id}`}>
                <span>{manager.name}</span>
            </Link>
            <Link
                onMouseEnter={() => setIsOnMouseEnter(true)}
                onMouseLeave={() => setIsOnMouseEnter(false)}
                className={!isOnMouseEnter ? 'field_link' : 'field_link_chosen'}
                // style={{borderLeft: '1px rgba(128, 128, 128, 0.5) solid'}}
                to={`/managers/${manager.id}`}>
                <span>{options[manager.role as keyof IRole]}</span>
            </Link>
        </div>
};

export default ManagerItem;