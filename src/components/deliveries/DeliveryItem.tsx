import React, {FC} from 'react';
import {IDelivery} from "../../interfaces";

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
            <span className={'field_order'}>{delivery.number}</span>
            <span className={'field_order'}>{delivery.deliveryMethod}</span>
            <span className={'field_order'}>{delivery.status.statusName}</span>
            <span className={'field_order'}>{getDate(delivery.creationDate)[1]}, {getDate(delivery.deliveryMethod)[0]}</span>
            <span className={'field_order'}>{delivery.deliveryCost}</span>
            <span className={'field_order'}>{delivery.partsCostRu}</span>
            <span className={'field_order'}>{delivery.orders.reduce((acc, item) => acc + item.itemsCnt, 0)}</span>
        </>
    );
};

export default DeliveryItem;