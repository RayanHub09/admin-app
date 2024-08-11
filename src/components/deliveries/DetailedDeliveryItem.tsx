import React, {FC} from 'react';
import {IDelivery} from "../../interfaces";
import {getDate} from "../../functions/newDate";

interface IDeliveryProps {
    delivery: IDelivery
}

const DetailedDeliveryItem: FC<IDeliveryProps> = ({delivery}) => {
    return (
        <div className={'detailed_delivery_item_container'}>
            <h2>Заказ № {delivery.number}</h2>
            <div className={'detailed_delivery_item'}>
                <h3 className={'label_order'}>Номер</h3>
                <span className={'field_order'}>{delivery.number}</span>
                <h3 className={'label_order'}>Способ</h3>
                <span className={'field_order'}>{delivery.deliveryMethod}</span>
                {delivery.ruDelivery !== null &&
                    <>
                        <h3 className={'label_order'}>Транспортная компания</h3>
                        <span className={'field_order'}>{delivery.ruDelivery.deliveryFromTC}</span>
                    </>
                }
                <h3 className={'label_order'}>Статус</h3>
                <span className={'field_order'}>{delivery.status.statusName}</span>
                <h3 className={'label_order'}>Кол-во товара</h3>
                <span className={'field_order'}>{delivery.orders.reduce((acc, item) =>
                    acc += item.itemsCnt, 0)}</span>
                <h3 className={'label_order'}>Вес</h3>
                <span className={'field_order'}>{}</span>
                <h3 className={'label_order'}>Стоимость доставки</h3>
                {delivery.deliveryCost && delivery.deliveryCostYen && <span
                    style={{fontWeight: '500'}}
                    className={'field_order'}>
                        {delivery.deliveryCostYen}¥ ({delivery.deliveryCost}₽)
                </span>}
                {!delivery.deliveryCost && !delivery.deliveryCostYen && <span className={'field_order'}></span>}
                <h3 className={'label_order'}>Стоимость товара</h3>
                <span className={'field_order'}
                      style={{fontWeight: '500'}}>
                    {delivery.partsCostYen}¥ ({delivery.partsCostRu}₽)</span>
                <h3 className={'label_order'}>Декларируемая стоимость</h3>
                <span className={'field_order'}>{}</span>
                <h3 className={'label_order'}>Время создания</h3>
                <span
                    className={'field_order'}>{getDate(delivery.creationDate)[1]}, {getDate(delivery.creationDate)[0]}</span>
                <h3 className={'label_order'}>ФИО</h3>
                <span className={'field_order'}>{delivery.customer.name} {delivery.customer.surname}</span>
                <h3 className={'label_order'}>Адрес</h3>
                <span className={'field_order'}>{delivery.customer.address}</span>
                <h3 className={'label_order'}>Телефон</h3>
                <span className={'field_order'}>{delivery.customer.phoneNumber}</span>
                <h3 className={'label_order'}>Номера накладных</h3>
                <span className={'field_order'}>{}</span>
                <h3 className={'label_order'}>Комментарий</h3>
                <span className={'field_order'}>{delivery.comment}</span>
            </div>
        </div>
    );
};

export default DetailedDeliveryItem;