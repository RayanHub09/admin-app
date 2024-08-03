import React, {FC, useState} from 'react';
import './orders.sass'
import {IOrder} from "../../interfaces";
import {Link} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {fetchChangeStatusOrder} from "../../store/slices/orders";

interface OrderItemProps {
    order: IOrder
}

const statusOrder:string[] = ['Не оплачен', 'В обработке', 'Обработка в Японии',
    'На складе в Японии', 'Ожидает упаковки', 'Упакован', 'Ожидает отправки из Японии',
    'Отправлен из Японии', 'Доставлен во Владивосток', 'Отправлен по России',
    'Доставлен получателю', 'Ожидает подтверждения', 'Отменен', 'Утилизирован']


const OrderItem: FC<OrderItemProps> = ({order}) => {

    const statusFetch = useAppSelector(state => state.orders.status)
    const [isDisabled, setIsDisabled] = useState(false)

    const dispatch = useAppDispatch()

    function getNewStatus(oldStatus:string):number {
        return statusOrder.findIndex(status => status === oldStatus) + 1
    }

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
                <Link to={`/orders/${order.id}`} className={'link_item'}>Перейти в заказ</Link>
                <button
                    onClick={changeStatusOrder}
                    disabled={isDisabled}
                    className={'promote_button'}>
                    {!isDisabled ? 'Продвинуть' : 'загрузка...'}
                </button>
            </div>
        </div>
    );
};

export default OrderItem;