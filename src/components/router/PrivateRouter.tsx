import React from 'react';
import {Navigate, Outlet, Route} from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux-hooks';

interface PrivateRouterProps {
    element: React.ReactElement,
}

const PrivateRouter = ({element} : PrivateRouterProps) => {
    const isAuth = useAppSelector(state => state.manager.isAuth);
    return (
        <>
            {(isAuth) ? element : <Navigate to={'/'}/>}
        </>
    )
};

export default PrivateRouter;
