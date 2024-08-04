import React, {FC, useState} from 'react';
import './orders.sass'
import {IOrder} from "../../interfaces";
import {Link} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {fetchChangeStatusOrder} from "../../store/slices/orders";
import {getNewStatus, statusOrder} from "../../lists/statusOrder";

interface OrderItemProps {
    order: IOrder
}

const OrderItem: FC<OrderItemProps> = ({order}) => {

    const statusFetch = useAppSelector(state => state.orders.status)
    const [isDisabled, setIsDisabled] = useState(false)
    const changeStatusDelivery = useAppSelector(state => state.manager.manager.changeStatusDelivery)
    const dispatch = useAppDispatch()

    function changeStatusOrder() {
        setIsDisabled(true)
        const numberNewStatus = getNewStatus(order.status.statusName)
        dispatch(fetchChangeStatusOrder({orderId:order.id, newStatus:statusOrder[numberNewStatus]}))
            .then(() => setIsDisabled(false))
    }
    return (
        <div className={'order_item_container'}>
            <div className={'order_item'}>
                <h4>{order.number}</h4>
                <span>{order.uid}</span>
            </div>
            <span>Статус: {order.status.statusName}</span>
            <div className={'fast_actions'}>
                <Link to={`/orders/${order.id}`} className={'link_item_button'}>Перейти в заказ</Link>
                {changeStatusDelivery &&
                    <button
                        onClick={changeStatusOrder}
                        disabled={isDisabled}
                        className={'promote_button'}>
                        {!isDisabled ? 'Продвинуть' : 'загрузка...'}
                    </button>
                }
            </div>
        </div>
    );
};

export default OrderItem;