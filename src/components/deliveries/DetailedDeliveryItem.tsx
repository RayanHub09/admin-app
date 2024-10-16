import React, {FC} from 'react';
import {IDelivery} from "../../interfaces";
import DetailedOrderItem from "../orders/DetailedOrderItem";
import {changeCost} from "../../functions/changeCost";

interface IDeliveryProps {
    delivery: IDelivery
}

const DetailedDeliveryItem: FC<IDeliveryProps> = ({delivery}) => {
    function getDate(str: string): string[] {
        const date = str?.split('T')[0]
        const time = str?.split('T')[1]?.toString()?.slice(0, -5)
        return [time, date]
    }
    return (
        <div className={'detailed_delivery_item_container'}>
            <h2>Посылка № {delivery.number}</h2>
            <div className={'detailed_delivery_item'}>
                <h3 className={'label_order'}>Номер</h3>
                <span className={'field'}>{delivery.number}</span>
                <h3 className={'label_order'}>Способ</h3>
                <span className={'field'}>{delivery.deliveryMethod}</span>
                {delivery.ruDelivery !== null &&
                    <>
                        <h3 className={'label_order'}>Транспортная компания</h3>
                        <span className={'field'}>{delivery.ruDelivery.deliveryFromTC}</span>
                    </>
                }
                <h3 className={'label_order'}>Статус</h3>
                <span className={'field'}>{delivery.status.statusName}</span>
                <h3 className={'label_order'}>Кол-во товара</h3>
                <span className={'field'}>{delivery.orders.reduce((acc, item) =>
                    acc += item.itemsCnt, 0)}</span>
                <h3 className={'label_order'}>Вес</h3>
                <span className={'field'}>{}</span>
                <h3 className={'label_order'}>Стоимость доставки</h3>
                {delivery.deliveryCost && delivery.deliveryCostYen && <span
                    style={{fontWeight: '500'}}
                    className={'field'}>
                        {delivery.deliveryCostYen}¥ ({delivery.deliveryCost}₽)
                </span>}
                {!delivery.deliveryCost && !delivery.deliveryCostYen && <span className={'field'}></span>}
                <h3 className={'label_order'}>Стоимость товара</h3>
                <span className={delivery.status.statusName !== 'Отменен' ? 'field' : 'field cancel_field'}><h4>{changeCost(delivery.partsCostYen.toString())}¥</h4>{changeCost(delivery.partsCostRu.toString())}₽</span>
                <h3 className={'label_order'}>Декларируемая стоимость</h3>
                <span className={'field'}>{}</span>
                <h3 className={'label_order'}>Время создания</h3>
                <span
                    className={'field'}>{getDate(delivery.creationDate)[1]}, {getDate(delivery.creationDate)[0]}</span>
                <h3 className={'label_order'}>ФИО</h3>
                <span className={'field'}>{delivery.customer.name} {delivery.customer.surname}</span>
                <h3 className={'label_order'}>Адрес</h3>
                <span className={'field'}>{delivery.customer.address}</span>
                <h3 className={'label_order'}>Телефон</h3>
                <span className={'field'}>{delivery.customer.phoneNumber}</span>
                <h3 className={'label_order'}>Номера накладных</h3>
                <span className={'field'}>{}</span>
                <h3 className={'label_order'}>Комментарий</h3>
                <span className={'field'}>{delivery.comment}</span>
            </div>
            <div>
                {delivery.orders.map((item, index) => <DetailedOrderItem key={index} order={item} />)}
            </div>
        </div>
    );
};

export default DetailedDeliveryItem;