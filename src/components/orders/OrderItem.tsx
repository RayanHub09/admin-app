import React, {FC, useState} from 'react';
import './orders.sass'
import {IDelivery, IOrder, IReOrder} from "../../interfaces";
import {Link} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {fetchChangeOrder, fetchChangeStatusOrder} from "../../store/slices/orders";
import {getNewStatus, statusOrder} from "../../lists/statusOrder";
import {fetchChangeStatusOrderDelivery} from "../../store/slices/deliveries";

interface OrderItemProps {
    order: IOrder,
    index: number
}

const OrderItem: FC<OrderItemProps> = ({order, index}) => {

    const [isDisabled, setIsDisabled] = useState(false)
    const manager = useAppSelector(state => state.manager.manager)
    const dispatch = useAppDispatch()
    const deliveries = useAppSelector(state => state.deliveries.deliveries)
    const getDeliveryIdByOrderId = (): string|null => {
        const delivery = deliveries.find(delivery =>
            delivery.orders && delivery.orders.some(item => item.id === order.id)
        )
        return delivery ? delivery.id : null
    };

    function changeStatusOrder() {
        setIsDisabled(true);
        const numberNewStatus = getNewStatus(order.status.statusName)
        const deliveryId = getDeliveryIdByOrderId()
        dispatch(fetchChangeStatusOrder({ orderId: order.id, newStatus: statusOrder[numberNewStatus] }))
            .then(() => {
                if (deliveryId !== null) {
                    dispatch(fetchChangeStatusOrderDelivery({ orderId: order.id, newStatus: statusOrder[numberNewStatus], deliveryId }))
                }
            })
            .finally(() => setIsDisabled(false));
    }
    return (
        <div className={index % 2 === 0 ? 'order_item_container' : 'grey_order_item_container'}>
            <div className={order.status.statusName !== 'Отменен' ? 'order_item' : 'order_item cancel_field'}>
                <h4>{order.number}</h4>
            </div>
            <span className={order.status.statusName !== 'Отменен' ? 'status' : 'cancel_field'}>Статус: {order.status.statusName}</span>
            <div className={'fast_actions'}>
                <Link to={`/orders/${order.id}`} className={'link_item_button'}>Перейти в заказ</Link>
                {(manager.changeStatusOrders || manager.role === 'admin') &&
                    <button
                        onClick={changeStatusOrder}
                        disabled={isDisabled || order.status.statusName === 'Отменен'}
                        className={'promote_button'}>
                        {isDisabled ? 'загрузка...' : 'Продвинуть'}
                    </button>
                }
            </div>
        </div>
    );
};

export default OrderItem;