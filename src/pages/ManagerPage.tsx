import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import {IManager} from "../interfaces";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import DetailedManagerItem from "../components/managers/DetailedManagerItem";
import ChangeDetailedManagerItem from "../components/managers/ChangeDetailedManagerItem";



const ManagerPage = () => {
    const [changeMode, setChangeMode] = useState(false)
    const { id } = useParams<{ id: string }>()
    const manager: IManager | undefined = useAppSelector(state =>
        state.managers.managers.find(manager => manager.id === id)
    )
    return (

        <div className={'manager_page_container'}>
            <DetailedManagerItem manager={manager as IManager} />
        </div>
    );
};

export default ManagerPage;