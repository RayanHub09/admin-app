import React, {FC, useState} from 'react';
import {IOrder} from "../../interfaces";
import {statusOrder} from "../../lists/statusOrder";
import {useAppDispatch} from "../../hooks/redux-hooks";
import {fetchChangeOrder} from "../../store/slices/orders";

interface OrderItemProps {
    order: IOrder
}

const ChangeDetailedOrderItem: FC<OrderItemProps> = ({order}) => {
    const dispatch = useAppDispatch()
    const [isDisabled, setIsDisabled] = useState(false)
    const [number, setNumber] = useState(order.number)
    const [comment, setComment] = useState(order.status.statusName)
    const [status, setStatus] = useState(order.status.statusName)

    function getDate(str: string): string[] {
        const date = str?.split('T')[0]
        const time = str?.split('T')[1].toString().slice(0, -5)
        return [time, date]
    }

    function changeOrder() {
        setIsDisabled(true)
        dispatch(fetchChangeOrder({orderId: order.id, newStatus: status,
            newComment: comment, newNumber: number
        })).then(() => setIsDisabled(false))

    }

    return (
        <div className={'detailed_order_item_container'}>
            <h2>Заказ № {order.number}</h2>
            <div className={'detailed_order_item'}>
                <h3 className={'label_order'}>Номер</h3>
                <input
                    className={'input_field_order'}
                    value={number}
                    onChange={event => setNumber(event.target.value)}
                />
                <h3 className={'label_order'}>Статус</h3>
                <select
                    value={status}
                    onChange={event => setStatus(event.target.value)}
                    className={'input_field_order'}
                >
                    {statusOrder.map((item, index) =>
                        <option
                            key={index}
                            className={'input_field_order'}
                            value={item}
                        >{item}</option>
                    )
                    }
                </select>
                <h3 className={'label_order'}>Кол-во товара (шт.)</h3>
                <span className={'field_order'}>{order.itemsCnt}</span>
                <h3 className={'label_order'}>Стоимость</h3>
                <span className={'field_order'} style={{fontWeight: '500'}}>{order.priceYen}¥ ({order.priceRu}₽)</span>
                <h3 className={'label_order'}>Примерный вес</h3>
                <span
                    className={'field_order'}>{order.items.reduce((acc, item) => acc = acc + item.part.weight, 0)}</span>
                <h3 className={'label_order'}>Дата заказа</h3>
                <span className={'field_order'}>{getDate(order.date)[1]}, {getDate(order.date)[0]}</span>
                <h3 className={'label_order'}>Комментарий</h3>
                <input
                    className={'input_field_order'}
                    onChange={event => setComment(event.target.value)}
                    value={comment}/>
            </div>
            <button
                onClick={changeOrder}
                className={'change_button'}
                disabled={isDisabled}
                style={{alignSelf: 'flex-end'}}>
                {!isDisabled ? 'Сохранить' : 'загрузка...'}</button>
        </div>
    )
};

export default ChangeDetailedOrderItem;