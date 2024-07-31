import React from 'react';
import NavBar from "../components/NavBar";
import {useAppSelector} from "../hooks/redux-hooks";
import {Navigate} from "react-router-dom";
import Workspace from "../components/Workspace";
import CreateManagers from "../components/managers/CreateManagers";

const MainPage = () => {
    const status = useAppSelector(state => state.worker.status)

    return <>
        {status === 'loading' && <h1 className={'loading'}>Загрузка...</h1>}
        {status === 'succeeded' && <CreateManagers />}
        {status === 'failed' && <Navigate to={'/signin'} />}
    </>
};

export default MainPage;