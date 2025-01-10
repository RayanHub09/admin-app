import React, { FC, useState } from 'react';
import { IDelivery } from "../../interfaces";
import { Link } from "react-router-dom";
import { changeCost } from "../../functions/changeCost";

interface IDeliveryProps {
    delivery: IDelivery
}

const DeliveryItem: FC<IDeliveryProps> = ({ delivery }) => {
    const [isOnMouseEnter, setIsOnMouseEnter] = useState(false);

    function getDate(str: string | undefined): string[] {
        if (typeof str !== 'string') {
            console.error('Expected a string but received:', str);
            return ['', ''];
        }

        const date = str.split('T')[0];
        const time = str.split('T')[1]?.toString()?.slice(0, -5);
        return [time, date];
    }

    // Если creationDate - это строка в формате ISO, используйте ее напрямую
    // const creationDateString = ; // Предположим, что это строка

    return (
        <>
            <Link
                onMouseEnter={() => setIsOnMouseEnter(true)}
                onMouseLeave={() => setIsOnMouseEnter(false)}
                to={`/deliveries/${delivery.id}`}
                className={(!isOnMouseEnter ? (delivery.status.statusName !== 'Отменен' ? 'field_link ' : 'cancel_field field_link ') : 'field_link_chosen')}
            >
                {delivery.number}
            </Link>
            <Link
                onMouseEnter={() => setIsOnMouseEnter(true)}
                onMouseLeave={() => setIsOnMouseEnter(false)}
                to={`/deliveries/${delivery.id}`}
                className={(!isOnMouseEnter ? (delivery.status.statusName !== 'Отменен' ? 'field_link ' : 'cancel_field field_link ') : 'field_link_chosen')}
            >
                {delivery.deliveryMethod}
            </Link>
            <Link
                onMouseEnter={() => setIsOnMouseEnter(true)}
                onMouseLeave={() => setIsOnMouseEnter(false)}
                to={`/deliveries/${delivery.id}`}
                className={(!isOnMouseEnter ? (delivery.status.statusName !== 'Отменен' ? 'field_link ' : 'cancel_field field_link ') : 'field_link_chosen')}
            >
                {delivery.status.statusName}
            </Link>
            <Link
                onMouseEnter={() => setIsOnMouseEnter(true)}
                onMouseLeave={() => setIsOnMouseEnter(false)}
                to={`/deliveries/${delivery.id}`}
                className={(!isOnMouseEnter ? (delivery.status.statusName !== 'Отменен' ? 'field_link ' : 'cancel_field field_link ') : 'field_link_chosen')}
            >
                {/*{getDate(delivery.creationDate)[1]}, {getDate(delivery.creationDate)[0]}*/}
                ss
            </Link>
            <Link
                onMouseEnter={() => setIsOnMouseEnter(true)}
                onMouseLeave={() => setIsOnMouseEnter(false)}
                to={`/deliveries/${delivery.id}`}
                className={(!isOnMouseEnter ? (delivery.status.statusName !== 'Отменен' ? 'field_link ' : 'cancel_field field_link ') : 'field_link_chosen')}
            >
                {delivery.deliveryCost}
            </Link>
            <Link
                onMouseEnter={() => setIsOnMouseEnter(true)}
                onMouseLeave={() => setIsOnMouseEnter(false)}
                to={`/deliveries/${delivery.id}`}
                className={(!isOnMouseEnter ? (delivery.status.statusName !== 'Отменен' ? 'field_link ' : 'cancel_field field_link ') : 'field_link_chosen')}
            >
                <h4>{changeCost(delivery.partsCostYen.toString())}¥</h4>{changeCost(delivery.partsCostRu.toString())}₽
            </Link>
            <Link
                onMouseEnter={() => setIsOnMouseEnter(true)}
                onMouseLeave={() => setIsOnMouseEnter(false)}
                to={`/deliveries/${delivery.id}`}
                className={(!isOnMouseEnter ? (delivery.status.statusName !== 'Отменен' ? 'field_link ' : 'cancel_field field_link ') : 'field_link_chosen')}
            >
                {delivery.orders.reduce((acc, item) => acc + item.itemsCnt, 0)}
            </Link>
        </>
    );
};

export default DeliveryItem;
