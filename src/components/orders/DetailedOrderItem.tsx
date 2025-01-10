import React, { FC } from 'react';
import { Link } from "react-router-dom";
import { IOrder } from "../../interfaces";
import ItemsList from "../items/ItemsList";
import { changeCost } from "../../functions/changeCost";

interface OrderItemProps {
    order: IOrder
}

const DetailedOrderItem: FC<OrderItemProps> = ({ order }) => {

    function getDate(str: string | undefined): string[] {
        if (typeof str !== 'string') {
            return ['', '']
        }

        const date = str.split('T')[0];
        const time = str.split('T')[1]?.toString()?.slice(0, -5);
        return [time, date];
    }

    return (
        <div className={'detailed_order_item_container'}>
            <Link to={`/orders/${order.id}`} className={'link_item'}>
                <h2>Заказ № {order.number}</h2>
            </Link>
            <div className={'detailed_order_item'}>
                <h3 className={'label_order'}>Номер</h3>
                <span className={'field'}>{order.number}</span>
                <h3 className={'label_order'}>Статус</h3>
                <span className={'field'}>{order.status.statusName}</span>
                <h3 className={'label_order'}>Кол-во товара (шт.)</h3>
                <span className={'field'}>{order.itemsCnt}</span>
                <h3 className={'label_order'}>Стоимость</h3>
                <span className={'field'}>
                    <h4>{order.priceYen ? changeCost(order.priceYen.toString()) : 'Не указано'}¥</h4>
                    {order.priceRu ? changeCost(order.priceRu.toString()) : 'Не указано'}₽
                </span>
                <h3 className={'label_order'}>Примерный вес</h3>
                <span className={'field'}>
                    {order.items ? order.items.reduce((acc, item) => acc + item.part.weight, 0) : 0}
                </span>
                <h3 className={'label_order'}>Дата заказа</h3>
                <span className={'field'}>
                    {/*{getDate(order.date)[1]}, {getDate(order.date)[0]}*/}

                </span>
                <h3 className={'label_order'}>Комментарий</h3>
                <span className={'field'}>{order.comment}</span>
            </div>
            <ItemsList itemsList={order.items} />
        </div>
    );
}

export default DetailedOrderItem;
