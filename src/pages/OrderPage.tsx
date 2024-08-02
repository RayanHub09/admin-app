import React from 'react';
import { useParams } from "react-router-dom";
import { useAppSelector } from "../hooks/redux-hooks";
import OrderItem from "../components/orders/OrderItem";
import { IOrder } from "../interfaces";
import DetailedOrderItem from "../components/orders/DetailedOrderItem";

const OrderPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const order: IOrder | undefined = useAppSelector(state =>
        state.orders.orders.find(order => order.id === id)
    )

    if (!order) {
        return <div>Order not found</div>;
    }
    return (
        <div className={'order_page_container'}>
            <DetailedOrderItem order={order} />
        </div>
    );
};

export default OrderPage;
