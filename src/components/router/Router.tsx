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
import DeliveryPage from "../../pages/DeliveryPage";
import ItemsPage from "../../pages/ItemsPage";
import ItemPage from "../../pages/ItemPage";
import ChatPage from "../../pages/ChatPage";
import SectionMessages from "../messages/SectionMessages";


const Router = () => {
    const isAdmin = useAppSelector(state => state.manager.manager.role) === 'admin'
    return (
        <Routes>
            <Route path="/" element={<SignInPage />} />
            <Route path={'/managers'} element={<PrivateRouter element={<ManagersPage />} /> } />
            <Route path={'/orders'} element={<PrivateRouter element={<OrdersPage />} /> } />
            <Route path={'/messages/:name'} element={<PrivateRouter element={<MessagesPage />} /> } />
            <Route path={'/messages/:name/:id'} element={<PrivateRouter element={<ChatPage />} /> } />
            {/*<Route path={'/messages/:name'} element={<PrivateRouter element={<SectionMessages />} /> } />*/}
            <Route path={'/deliveries'} element={<PrivateRouter element={<DeliveriesPage />} /> } />
            <Route path={'/items'} element={<PrivateRouter element={<ItemsPage />} /> } />
            <Route path={'/items/:id'} element={<PrivateRouter element={<ItemPage />} /> } />
            <Route path={'/deliveries/:id'} element={<PrivateRouter element={<DeliveryPage />} /> } />
            <Route path={'/managers/:id'} element={<PrivateRouter element={<ManagerPage />} /> } />
            <Route path={'/orders/:id'} element={<PrivateRouter element={<OrderPage />} /> } />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default Router;
