import React, { FC } from 'react';
import { Link } from "react-router-dom";
import { IOrder, IReOrder } from "../../interfaces";
import ItemsList from "../items/ItemsList";
import { changeCost } from "../../functions/changeCost";
import { useAppSelector } from "../../hooks/redux-hooks";
import { getDate } from "../../functions/changeDate";

interface OrderItemProps {
    order: IOrder;
}

const DetailedOrderItem: FC<OrderItemProps> = ({ order }) => {
    const user = useAppSelector(state => state.users.users).find(user => user.id === order.uid);
    const items = useAppSelector(state => state.items.items).filter(item => item.idOrder === order.id);

    return (
        <div className={'detailed_order_item_container'}>
            <Link to={`/orders/${order.id}`} className={'link_item'}>
                <h2>Заказ № {order.number}</h2>
            </Link>
            <div className={'detailed_order_item'}>
                <h3 className={'label_order'} style={{ borderTop: '1px rgba(128, 128, 128, 0.5) solid' }}>Номер</h3>
                <span className={'field'} style={{ borderTop: '1px rgba(128, 128, 128, 0.5) solid' }}>{order.number}</span>
                <h3 className={'label_order'}>Статус</h3>
                <span className={'field'}>{order.status.statusName}</span>
                <h3 className={'label_order'}>Кол-во товара (шт.)</h3>
                <span className={'field'}>{order.itemsCnt}</span>
                <h3 className={'label_order'}>Стоимость</h3>
                <span className={'field'}>
                    <h4>{order.priceYen.toString() ? changeCost(order.priceYen.toString()) : 'Не указано'}¥</h4>
                    {order.priceRu.toString() ? changeCost(order.priceRu.toString()) : 'Не указано'}₽
                </span>
                <h3 className={'label_order'}>Примерный вес</h3>
                <span className={'field'}>
    {order.items
        ? parseFloat((order.items.reduce((acc, item) => acc + item.part.weight, 0)).toFixed(3))
        : '0'}
</span>

                <h3 className={'label_order'}>Дата заказа</h3>
                <span className={'field'}>
                    {getDate(order.date)[1]}, {getDate(order.date)[0]}
                </span>
                <h3 className={'label_order'}>Комментарий</h3>
                <span className={'field'}>{order.comment}</span>
                <h3 className={'label_order'}>Покупатель</h3>
                <Link
                    className={'field'}
                    style={{ borderLeft: '1px rgba(128, 128, 128, 0.5) solid' }}
                    to={`/users/${order.uid}`}>
                    <span>{user?.name} {user?.surname} {user?.patronymic}</span>
                </Link>
            </div>
            <ItemsList itemsList={items} />
        </div>
    );
}

export default DetailedOrderItem;
