import React from 'react';
import {Navigate, Outlet, Route} from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux-hooks';
import SignInPage from "../../pages/SignInPage";

interface PrivateRouterProps {
    element: React.ReactElement
}

const PrivateRouter = ({element} : PrivateRouterProps) => {
    const isAuth = useAppSelector(state => state.worker.isAuth);

    return isAuth ? element : <Navigate to={'/signin'} />
};

export default PrivateRouter;
