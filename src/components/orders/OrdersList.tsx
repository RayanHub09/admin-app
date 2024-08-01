import React from 'react';
import {useAppSelector} from "../../hooks/redux-hooks";
import OrderItem from "./OrderItem";

const OrdersList = () => {
    const orders = useAppSelector(state => state.orders.orders)

    function getDate(str:string):string[]{
        const date = str.split('T')[0]
        const time = str.split('T')[1].toString().slice(0,-1)
        return [time, date]
    }
    return (
        <div className={'orders_list_container'}>
            {orders.map((item) => (
                <OrderItem key={item.id} order={item}/>
            ))}
        </div>
    );
};

export default OrdersList;