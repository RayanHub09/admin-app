import React, {FC, useState} from 'react';
import {Link} from "react-router-dom";
import {IOrder} from "../../interfaces";

interface OrderGridItemProps {
    order: IOrder
}


const OrderGridItem: FC<OrderGridItemProps> = ({order}) => {
    const [isOnMouseEnter, setIsOnMouseEnter] = useState(false)
    return (
        <>
            <Link
                onMouseEnter={() => setIsOnMouseEnter(true)}
                onMouseLeave={() => setIsOnMouseEnter(false)}
                className={!isOnMouseEnter ? 'field_link' : 'field_link_chosen'}
                style={{borderLeft: '1px rgba(128, 128, 128, 0.5) solid'}}
                to={`/orders/${order.id}`}>
                <span>{order.id}</span>
            </Link>
            <Link
                onMouseEnter={() => setIsOnMouseEnter(true)}
                onMouseLeave={() => setIsOnMouseEnter(false)}
                className={!isOnMouseEnter ? 'field_link' : 'field_link_chosen'}
                style={{borderLeft: '1px rgba(128, 128, 128, 0.5) solid'}}
                to={`/orders/${order.id}`}>
                <span>{order.number}</span>
            </Link>
            <Link
                onMouseEnter={() => setIsOnMouseEnter(true)}
                onMouseLeave={() => setIsOnMouseEnter(false)}
                className={!isOnMouseEnter ? 'field_link' : 'field_link_chosen'}
                style={{borderLeft: '1px rgba(128, 128, 128, 0.5) solid'}}
                to={`/orders/${order.id}`}>
                <span>{order.status.statusName}</span>
            </Link>
            <Link
                onMouseEnter={() => setIsOnMouseEnter(true)}
                onMouseLeave={() => setIsOnMouseEnter(false)}
                className={!isOnMouseEnter ? 'field_link' : 'field_link_chosen'}
                style={{borderLeft: '1px rgba(128, 128, 128, 0.5) solid'}}
                to={`/orders/${order.id}`}>
                <span>{order.comment}</span>
            </Link>
        </>
    );
};

export default OrderGridItem;