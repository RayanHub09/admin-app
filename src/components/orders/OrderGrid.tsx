import React, {FC, useState} from 'react';
import {IOrder} from "../../interfaces";
import {Link} from "react-router-dom";
import OrderGridItem from "./OrderGridItem";

interface OrderGridProps {
    orders: IOrder[]
}
const OrderGrid:FC<OrderGridProps> = ({orders}) => {

    return (
        <div className={'order_grid_container'}>
            <span style={{borderLeft: '1px rgba(128, 128, 128, 0.5) solid'}} className={'label_user'}>ID</span>
            <span className={'label_user'}>Номер</span>
            <span className={'label_user'}>Статус</span>
            <span className={'label_user'}>Комментарий</span>
            {orders.map(order => <>
                <OrderGridItem order={order} key={order.id} />
            </>)}
        </div>
    );
};

export default OrderGrid;