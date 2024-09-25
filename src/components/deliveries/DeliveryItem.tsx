import React, {FC} from 'react';
import {IDelivery} from "../../interfaces";
import {Link} from "react-router-dom";
import {changeCost} from "../../functions/changeCost";

interface IDeliveryProps {
    delivery:IDelivery
}

const DeliveryItem:FC<IDeliveryProps> = ({delivery}) => {
    function getDate(str: string): string[] {
        const date = str?.split('T')[0]
        const time = str?.split('T')[1]?.toString()?.slice(0, -5)
        return [time, date]
    }
    return (
        <>
            <span className={delivery.status.statusName !== 'Отменен' ? 'field' : 'field cancel_field'}><Link to={`/deliveries/${delivery.id}`} className={delivery.status.statusName !== 'Отменен' ? 'link_item' : 'link_item cancel_field'}>{delivery.number}</Link></span>
            <span className={delivery.status.statusName !== 'Отменен' ? 'field' : 'field cancel_field'}>{delivery.deliveryMethod}</span>
            <span className={delivery.status.statusName !== 'Отменен' ? 'field' : 'field cancel_field'}>{delivery.status.statusName}</span>
            <span className={delivery.status.statusName !== 'Отменен' ? 'field' : 'field cancel_field'}>{getDate(delivery.creationDate)[1]}, {getDate(delivery.creationDate)[0]}</span>
            <span className={delivery.status.statusName !== 'Отменен' ? 'field' : 'field cancel_field'}>{delivery.deliveryCost}</span>
            <span className={delivery.status.statusName !== 'Отменен' ? 'field' : 'field cancel_field'}><h4>{changeCost(delivery.partsCostYen.toString())}¥</h4>{changeCost(delivery.partsCostRu.toString())}₽</span>
            <span className={delivery.status.statusName !== 'Отменен' ? 'field' : 'field cancel_field'}>{delivery.orders.reduce((acc, item) => acc + item.itemsCnt, 0)}</span>
        </>
    );
};

export default DeliveryItem;