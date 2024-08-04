import React, {useState} from 'react';
import { useParams } from "react-router-dom";
import { useAppSelector } from "../hooks/redux-hooks";
import OrderItem from "../components/orders/OrderItem";
import { IOrder } from "../interfaces";
import DetailedOrderItem from "../components/orders/DetailedOrderItem";
import ChangeDetailedOrderItem from "../components/orders/ChangeDetailedOrderItem";

const OrderPage: React.FC = () => {
    const [changeMode, setChangeMode] = useState(false)
    const { id } = useParams<{ id: string }>()
    const order: IOrder | undefined = useAppSelector(state =>
        state.orders.orders.find(order => order.id === id)
    )

    if (!order) {
        return <div>Order not found</div>;
    }
    return (
        <div className={'order_page_container'}>
            <button
                onClick={() => setChangeMode(!changeMode)}
                className={'change_button'}>
                {changeMode ? 'Вернуться к заказу' : 'Изменить'}
            </button>
            {changeMode ? <ChangeDetailedOrderItem order={order} /> : <DetailedOrderItem order={order} />}
        </div>
    );
};

export default OrderPage;
