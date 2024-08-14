import React, {useEffect} from 'react';
import './App.sass';
import Router from "./components/router/Router";
import Header from "./components/Header";
import {useAppDispatch, useAppSelector} from "./hooks/redux-hooks";
import {fetchGetAllManagers} from "./store/slices/managers";
import {fetchGetAllOrders} from "./store/slices/orders";
import {fetchGetAllDeliveries} from "./store/slices/deliveries";
import {getAllItems} from "./store/slices/items";
import {IItem, IOrder} from "./interfaces";


function App() {
    const dispatch = useAppDispatch()
    const isAuth = useAppSelector(state => state.manager.isAuth)

    useEffect(() => {
        if (isAuth) {
            dispatch(fetchGetAllManagers())
            dispatch(fetchGetAllOrders())
                .then(data => data.payload as IOrder[])
                .then(orders => orders.reduce((acc, order) => acc = [...acc, ...order.items], [] as IItem[]))
                .then(items => dispatch(getAllItems(items)))
            dispatch(fetchGetAllDeliveries())

        }
    }, [isAuth])

    return (
        <div className={'App'}>
            <Header />
            <Router />
        </div>
    )
}

export default App;
