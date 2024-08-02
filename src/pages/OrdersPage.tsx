import React from 'react';
import {useAppSelector} from "../hooks/redux-hooks";
import OrdersList from "../components/orders/OrdersList";

const OrdersPage = () => {

    return (
        <div className={'orders_page_container'}>
            <OrdersList />
        </div>

    );
};

export default OrdersPage;