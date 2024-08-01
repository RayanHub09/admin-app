import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignInPage from "../../pages/SignInPage";
import ManagersPage from "../../pages/ManagersPage";
import OrdersPage from "../../pages/OrdersPage";
import PrivateRouter from "./PrivateRouter";
import {useAppSelector} from "../../hooks/redux-hooks";

const Router = () => {
    const isAdmin = useAppSelector(state => state.manager.manager.role) === 'admin'
    return (
        <Routes>
            <Route path="/" element={<SignInPage />} />
            {isAdmin && <Route path={'/managers'} element={<PrivateRouter element={<ManagersPage />} /> } />}
            <Route path={'/orders'} element={<PrivateRouter element={<OrdersPage />} /> } />
        </Routes>
    );
};

export default Router;
