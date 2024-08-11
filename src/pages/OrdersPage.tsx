import React, {useEffect} from 'react';
import OrdersList from "../components/orders/OrdersList";
import {useAppDispatch} from "../hooks/redux-hooks";
import {clearSearch} from "../store/slices/orders";


const OrdersPage = () => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(clearSearch())
    }, [])
    return (
        <div className={'orders_page_container'}>
            <OrdersList />
        </div>
    )
};

export default OrdersPage;