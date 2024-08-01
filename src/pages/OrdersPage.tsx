import React from 'react';
import {useAppSelector} from "../hooks/redux-hooks";
import CreateManagers from "../components/managers/CreateManagers";
import {Navigate} from "react-router-dom";

const OrdersPage = () => {
    const status = useAppSelector(state => state.manager.status)
    return (
        <div className={'container'}>

            {status === 'loading' && <h1 className={'loading'}>Загрузка...</h1>}
            {status === 'succeeded' && <h1>Заказы</h1>}
            {status === 'failed' && <Navigate to={'/signin'} />}
        </div>

    );
};

export default OrdersPage;