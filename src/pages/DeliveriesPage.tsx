import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {fetchGetAllOrders} from "../store/slices/orders";
import {fetchGetAllDeliveries} from "../store/slices/deliveries";

const DeliveriesPage = () => {
    // const dispatch = useAppDispatch()
    // const isAuth = useAppSelector(state => state.manager.isAuth)
    // const statusDeliveries = useAppSelector(state => state.deliveries.status)
    //
    // useEffect(() => {
    //     if (isAuth) {
    //         dispatch(fetchGetAllDeliveries())
    //     }
    // }, [statusDeliveries])
    return (
        <div>
            
        </div>
    );
};

export default DeliveriesPage;