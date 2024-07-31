import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignInPage from "../../pages/SignInPage";
import MainPage from "../../pages/MainPage";
import CreateManagers from "../managers/CreateManagers";
import ManagersPage from "../../pages/ManagersPage";
import OrdersPage from "../../pages/OrdersPage";
import PrivateRouter from "./PrivateRouter";

const Router = () => {
    return (
        <Routes>
            <Route path="/signin" element={<SignInPage />} />
            <Route path={'/managers'} element={<PrivateRouter element={<ManagersPage />} /> } />
            <Route path={'/orders'} element={<PrivateRouter element={<OrdersPage />} /> } />
            {/*<PrivateRouter element={<Route path="/managers" element={} />} />*/}
        </Routes>
    );
};

export default Router;
