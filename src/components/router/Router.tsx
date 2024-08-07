import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignInPage from "../../pages/SignInPage";
import ManagersPage from "../../pages/ManagersPage";
import OrdersPage from "../../pages/OrdersPage";
import PrivateRouter from "./PrivateRouter";
import {useAppSelector} from "../../hooks/redux-hooks";
import NotFoundPage from "../../pages/NotFoundPage";
import MessagesPage from "../../pages/MessagesPage";
import ManagerPage from "../../pages/ManagerPage";
import OrderPage from "../../pages/OrderPage";
import DeliveriesPage from "../../pages/DeliveriesPage";


const Router = () => {
    const isAdmin = useAppSelector(state => state.manager.manager.role) === 'admin'
    return (
        <Routes>
            <Route path="/" element={<SignInPage />} />
            <Route path={'/managers'} element={<PrivateRouter element={<ManagersPage />} /> } />
            <Route path={'/orders'} element={<PrivateRouter element={<OrdersPage />} /> } />
            <Route path={'/messages'} element={<PrivateRouter element={<MessagesPage />} /> } />
            <Route path={'/deliveries'} element={<PrivateRouter element={<DeliveriesPage />} /> } />
            <Route path={'/managers/:id'} element={<PrivateRouter element={<ManagerPage />} /> } />
            <Route path={'/orders/:id'} element={<PrivateRouter element={<OrderPage />} /> } />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default Router;
