import React from 'react';
import {useAppSelector} from "../hooks/redux-hooks";
import CreateManagers from "../components/managers/CreateManagers";
import {Navigate} from "react-router-dom";
import OrdersList from "../components/orders/OrdersList";

const OrdersPage = () => {
    const status = useAppSelector(state => state.manager.status)

    return (
        <div className={'orders_page_container'}>
            <OrdersList />

        </div>

    );
};

export default OrdersPage;