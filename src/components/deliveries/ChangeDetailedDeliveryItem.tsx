import React, {FC, useState} from 'react';
import {IDelivery} from "../../interfaces";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {statusDelivery} from "../../lists/statusDelivery";
import {fetchChangeDelivery, resetStatus} from "../../store/slices/deliveries";
import {getDate} from "../../functions/newDate";

interface IDeliveryProps {
    delivery: IDelivery
}

const ChangeDetailedDeliveryItem:FC<IDeliveryProps> = ({delivery}) => {
    const dispatch = useAppDispatch()
    const statusFetch = useAppSelector(state => state.deliveries.status)
    const writeCommentsDelivery = useAppSelector(state => state.manager.manager.writeCommentsDelivery)
    const changeStatusDelivery = useAppSelector(state => state.manager.manager.changeStatusDelivery)
    const changeDeliveryNumber = useAppSelector(state => state.manager.manager.changeDeliveryNumber)
    const [number, setNumber] = useState(delivery.number)
    const [status, setStatus] = useState(delivery.status.statusName)
    const [comment, setComment] = useState(delivery.comment)

    function changeDelivery() {
        dispatch(fetchChangeDelivery({deliveryId: delivery.id, newStatus: status,
            newComment: comment, newNumber: number}))
            .then(() => dispatch(resetStatus()))

    }

    return (
        <div className={'detailed_delivery_item_container'}>
            <button
                onClick={changeDelivery}
                disabled={statusFetch === 'loading'}
                className={'change_button'}>
                {statusFetch === 'loading' ? 'загрузка...' : 'Сохранить'}
            </button>
            <h2>Заказ № {delivery.number}</h2>
            <div className={'detailed_delivery_item'}>
                <h3 className={'label_order'}>Номер</h3>
                {changeDeliveryNumber ?
                    <input
                        value={number}
                        onChange={(event) => setNumber(event.target.value)}
                        className={'input_field_order'}/> :
                    <span className={'field_order'}>{delivery.number}</span>
                }
                <h3 className={'label_order'}>Способ</h3>
                <span className={'field_order'}>{delivery.deliveryMethod}</span>
                {delivery.ruDelivery !== null &&
                    <>
                        <h3 className={'label_order'}>Транспортная компания</h3>
                        <span className={'field_order'}>{delivery.ruDelivery.deliveryFromTC}</span>
                    </>
                }
                <h3 className={'label_order'}>Статус</h3>
                {changeStatusDelivery ?
                    <select
                        value={status}
                        onChange={event => setStatus(event.target.value)}
                        className={'input_field_order'}>
                        {statusDelivery.map((item, index) =>
                            <option
                                key={index}
                                className={'input_field_order'}
                                value={item}>
                                {item}</option>
                        )}
                    </select> :
                    <span className={'field_order'}>{delivery.status.statusName}</span>}
                <h3 className={'label_order'}>Кол-во товара</h3>
                <span className={'field_order'}>{delivery.orders.reduce((acc, item) =>
                    acc += item.itemsCnt, 0)}</span>
                <h3 className={'label_order'}>Вес</h3>
                <span className={'field_order'}>{}</span>
                <h3 className={'label_order'}>Стоимость доставки</h3>
                {delivery.deliveryCost && delivery.deliveryCostYen &&  <span
                    style={{fontWeight: '500'}}
                    className={'field_order'}>
                        {delivery.deliveryCostYen}¥ ({delivery.deliveryCost}₽)
                </span>}
                {!delivery.deliveryCost && !delivery.deliveryCostYen &&  <span className={'field_order'}></span>}
                <h3 className={'label_order'}>Стоимость товара</h3>
                <span className={'field_order'}
                      style={{fontWeight: '500'}}>
                    {delivery.partsCostYen}¥ ({delivery.partsCostRu}₽)</span>
                <h3 className={'label_order'}>Декларируемая стоимость</h3>
                <span className={'field_order'}>{}</span>
                <h3 className={'label_order'}>Время создания</h3>
                <span className={'field_order'}>{getDate(delivery.creationDate)[1]}, {getDate(delivery.creationDate)[0]}</span>
                <h3 className={'label_order'}>ФИО</h3>
                <span className={'field_order'}>{delivery.customer.name} {delivery.customer.surname}</span>
                <h3 className={'label_order'}>Адрес</h3>
                <span className={'field_order'}>{delivery.customer.address}</span>
                <h3 className={'label_order'}>Телефон</h3>
                <span className={'field_order'}>{delivery.customer.phoneNumber}</span>
                <h3 className={'label_order'}>Номера накладных</h3>
                <span className={'field_order'}>{}</span>
                <h3 className={'label_order'}>Комментарий</h3>
                {writeCommentsDelivery ?
                    <input
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        className={'input_field_order'}/> :
                    <span className={'field_order'}>{delivery.comment}</span>
                }
            </div>
        </div>
    );
};

export default ChangeDetailedDeliveryItem;