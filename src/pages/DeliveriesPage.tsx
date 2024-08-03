import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {fetchGetAllOrders} from "../store/slices/orders";
import {fetchGetAllDeliveries} from "../store/slices/deliveries";
import DeliveriesList from "../components/deliveries/DeliveriesList";

const DeliveriesPage = () => {
    return (
        <div className={'deliveries_page_container'}>
            <DeliveriesList />
        </div>
    );
};

export default DeliveriesPage;