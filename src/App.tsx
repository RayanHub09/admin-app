import React, {useEffect} from 'react';
import './App.sass';
import Router from "./components/router/Router";
import Header from "./components/Header";
import {useAppDispatch, useAppSelector} from "./hooks/redux-hooks";
import {fetchGetAllManagers} from "./store/slices/managers";
import {fetchGetAllOrders} from "./store/slices/orders";
import {fetchGetAllDeliveries} from "./store/slices/deliveries";
import {getAllItems} from "./store/slices/items";
import {IDelivery, IItem, IOrder, IReItem, IReOrder} from "./interfaces";
import {fetchAutoSignIn} from "./store/slices/manager";
import {useNavigate} from "react-router-dom";
import {fetchGetAllChats} from "./store/slices/messages";
import {fetchGetAllUsers} from "./store/slices/users";


function App() {
    const dispatch = useAppDispatch()
    const manager = useAppSelector(state => state.manager)
    const uid = useAppSelector(state => state.manager?.manager?.id)
    const navigation = useNavigate()

    useEffect(() => {
        if (manager.isAuth) {
            dispatch(fetchGetAllManagers())
            dispatch(fetchGetAllChats())
            dispatch(fetchGetAllUsers())
            dispatch(fetchGetAllOrders())
            dispatch(fetchGetAllDeliveries())
                .then((data) => data.payload as IDelivery[])
                .then((deliveries) => {
                    if (deliveries.length > 0) {
                        const orders = deliveries.reduce((acc, delivery) => {
                            return [...acc, ...delivery.orders.map((order) => ({ ...order, numberDelivery: delivery.number } as IReOrder))];
                        }, [] as IReOrder[]);

                        const items = orders.reduce((acc, order) => {
                            return [...acc, ...order.items.map((item) => ({ ...item, dateOrder: order.date, numberOrder: order.number, numberDelivery: order.numberDelivery, statusOrder: order.status.statusName } as IReItem))];
                        }, [] as IReItem[]);

                        dispatch(getAllItems(items));
                    }
                });
        }
    }, [manager.isAuth]);
    useEffect(() => {
        if (manager.token) {
            navigation('/orders')
            dispatch(fetchAutoSignIn())
        }
    }, [])


    return (
        <div className={'App'}>
            <Header />
            <Router />
        </div>
    )
}

export default App;
