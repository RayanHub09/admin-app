import React, {useEffect} from 'react';
import './App.sass';
import Router from "./components/router/Router";
import Header from "./components/Header";
import {useAppDispatch, useAppSelector} from "./hooks/redux-hooks";
import {fetchGetAllManagers} from "./store/slices/managers";
import {fetchGetAllOrders} from "./store/slices/orders";
import {fetchGetAllDeliveries} from "./store/slices/deliveries";


function App() {
    const dispatch = useAppDispatch()
    const isAuth = useAppSelector(state => state.manager.isAuth)

    useEffect(() => {
        if (isAuth) {
            dispatch(fetchGetAllManagers())
            dispatch(fetchGetAllOrders())
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
