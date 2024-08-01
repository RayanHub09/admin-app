import React from 'react';
import {useAppSelector} from "../hooks/redux-hooks";
import CreateManagers from "../components/managers/CreateManagers";
import {Navigate} from "react-router-dom";

const OrdersPage = () => {
    const status = useAppSelector(state => state.manager.status)
    const orders = useAppSelector(state => state.orders.orders)

    function getDate(str:string):string[]{
        const date = str.split('T')[0]
        const time = str.split('T')[1].toString().slice(0,-1)
        return [time, date]
    }


    return (
        <div className={'orders_page_container'}>
            {orders.map((item) => (
                <div key={item.id}>
                    <span>{item.id}</span>
                    <span>{getDate(item.date)[0]}</span>
                    
                </div>
            ))}

        </div>

    );
};

export default OrdersPage;