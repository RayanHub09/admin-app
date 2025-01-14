import React, {FC, useState} from 'react';
import {Link} from "react-router-dom";
import {IOrder} from "../../interfaces";
import {changeCost} from "../../functions/changeCost";
import {getDate} from "../../functions/changeDate";

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
                <span>{order.number}</span>
            </Link>
            <Link
                onMouseEnter={() => setIsOnMouseEnter(true)}
                onMouseLeave={() => setIsOnMouseEnter(false)}
                className={!isOnMouseEnter ? 'field_link' : 'field_link_chosen'}
                style={{borderLeft: '1px rgba(128, 128, 128, 0.5) solid'}}
                to={`/orders/${order.id}`}>
                <span>{getDate(order.date)[1]}, {getDate(order.date)[0]}</span>
            </Link>
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
                <h4>{changeCost(order.priceYen.toString())}¥</h4>{changeCost(order.priceRu.toString())}₽
            </Link>
            <Link
                onMouseEnter={() => setIsOnMouseEnter(true)}
                onMouseLeave={() => setIsOnMouseEnter(false)}
                className={!isOnMouseEnter ? 'field_link' : 'field_link_chosen'}
                style={{borderLeft: '1px rgba(128, 128, 128, 0.5) solid'}}
                to={`/orders/${order.id}`}>
                <span>{order.items.reduce((acc, item) => acc + item.amount, 0)}</span>
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