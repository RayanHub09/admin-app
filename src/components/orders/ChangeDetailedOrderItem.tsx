import React, {FC, useState} from 'react';
import {IOrder, IReOrder} from "../../interfaces";
import {statusOrder} from "../../lists/statusOrder";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {fetchChangeOrder} from "../../store/slices/orders";
import {getDate} from "../../functions/changeDate";
import {fetchChangeOrderDelivery} from "../../store/slices/deliveries";

interface OrderItemProps {
    order: IOrder & IReOrder
}

const ChangeDetailedOrderItem: FC<OrderItemProps> = ({order}) => {
    const dispatch = useAppDispatch()
    const [isDisabled, setIsDisabled] = useState(false)
    const [number, setNumber] = useState(order.number)
    const [comment, setComment] = useState(order.comment)
    const [status, setStatus] = useState(order.status.statusName)
    const manager = useAppSelector(state => state.manager.manager)
    const writeCommentsOrder = useAppSelector(state => state.manager.manager.writeCommentsOrder)
    const changeStatusDelivery = useAppSelector(state => state.manager.manager.changeStatusDelivery)
    const changeOrderNumber = useAppSelector(state => state.manager.manager.changeOrderNumber)
    const deliveries = useAppSelector(state => state.deliveries.deliveries)
    const [error, setError] = useState('')

    const numbersOrders = useAppSelector(state => state.orders.orders).map(order => order.number)
    const getDeliveryIdByOrderId = (): string | null => {
        const delivery = deliveries.find(delivery =>
            delivery.orders && delivery.orders.some(item => item.id === order.id)
        )
        return delivery ? delivery.id : null
    };


    function changeOrder() {
        if (numbersOrders.includes(number) && order.number !== number) {
            setError('Данный номер уже занят. Попробуйте другой.')
            setTimeout(() => setError(''), 4000)
        } else {
            setError('')
            setIsDisabled(true)
            dispatch(fetchChangeOrder({
                orderId: order.id, newStatus: status,
                newComment: comment, newNumber: number,
            })).then(() => setIsDisabled(false))
            const deliveryId = getDeliveryIdByOrderId()
            if (deliveryId)
                dispatch(fetchChangeOrderDelivery({
                    deliveryId, orderId: order.id, newStatus: status,
                    newComment: comment, newNumber: number,
                }))
        }

    }

    return (
        <div className={'detailed_order_item_container'}>
            <div className={'container'}>
                <button
                    onClick={changeOrder}
                    className={'change_button'}
                    disabled={isDisabled}>
                    {!isDisabled ? 'Сохранить' : 'загрузка...'}</button>
                {error &&
                    <div className={'error'}>
                        {error}
                    </div>}
            </div>
            <h2>Заказ № {order.number}</h2>

            <div className={'detailed_order_item'}>
                <h3 className={'label_order'} style={{borderTop: '1px rgba(128, 128, 128, 0.5) solid'}}>Номер</h3>
                {(changeOrderNumber || manager.role === 'admin') ?
                    <input
                        className={'input_field'}
                        value={number}
                        onChange={event => setNumber(event.target.value)}
                    /> :
                    <span className={'field'}>{order.number}</span>
                }
                <h3 className={'label_order'}>Статус</h3>
                {(changeStatusDelivery || manager.role === 'admin') ?
                    <select
                        value={status}
                        onChange={event => setStatus(event.target.value)}
                        className={'input_field'}
                    >
                        {statusOrder.map((item, index) =>
                            <option
                                key={index}
                                className={'input_field'}
                                value={item}
                            >{item}</option>
                        )
                        }
                    </select> :
                    <span className={'field'}>{order.status.statusName}</span>
                }
                <h3 className={'label_order'}>Кол-во товара (шт.)</h3>
                <span className={'field'}>{order.itemsCnt}</span>
                <h3 className={'label_order'}>Стоимость</h3>
                <span className={'field'} style={{fontWeight: '500'}}>{order.priceYen}¥ ({order.priceRu}₽)</span>
                <h3 className={'label_order'}>Примерный вес</h3>
                <span
                    className={'field'}>{order.items.reduce((acc, item) => acc = acc + item.part.weight, 0)}</span>
                <h3 className={'label_order'}>Дата заказа</h3>
                <span className={'field'}>{getDate(order.date)[1]}, {getDate(order.date)[0]}</span>
                <h3 className={'label_order'}>Комментарий</h3>
                {(writeCommentsOrder || manager.role === 'admin') ?
                    <input
                        className={'input_field'}
                        onChange={event => setComment(event.target.value)}
                        value={comment}/>
                    : <span className={'field'}>{order.comment}</span>
                }
            </div>

        </div>
    )
};

export default ChangeDetailedOrderItem;