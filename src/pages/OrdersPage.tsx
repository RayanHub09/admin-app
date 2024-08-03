import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import OrdersList from "../components/orders/OrdersList";
import {fetchGetAllManagers} from "../store/slices/managers";
import {fetchGetAllOrders} from "../store/slices/orders";
import {fetchGetAllDeliveries} from "../store/slices/deliveries";
import Loading from "../components/Loading";

const OrdersPage = () => {

    // const dispatch = useAppDispatch()
    // const isAuth = useAppSelector(state => state.manager.isAuth)
    // const statusOrder = useAppSelector(state => state.orders.status)
    //
    // useEffect(() => {
    //     if (isAuth) {
    //         dispatch(fetchGetAllOrders())
    //     }
    // }, [])

    return (
        <div className={'orders_page_container'}>
            <OrdersList />
        </div>
    )
};

export default OrdersPage;