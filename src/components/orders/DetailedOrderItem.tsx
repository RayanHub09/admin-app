import React, {FC} from 'react';
import {Link} from "react-router-dom";
import {IOrder} from "../../interfaces";
import ItemsList from "./items/ItemsList";
import {getDate} from "../../functions/newDate";

interface OrderItemProps {
    order: IOrder
}

const DetailedOrderItem: FC<OrderItemProps> = ({order}) => {


    return (
        <div className={'detailed_order_item_container'}>
            <h2>Заказ № {order.number}</h2>

            <div className={'detailed_order_item'}>
                <h3 className={'label_order'}>Номер</h3>
                <span className={'field_order'}>{order.number}</span>
                <h3 className={'label_order'}>Статус</h3>
                <span className={'field_order'}>{order.status.statusName}</span>
                <h3 className={'label_order'}>Кол-во товара (шт.)</h3>
                <span className={'field_order'}>{order.itemsCnt}</span>
                <h3 className={'label_order'}>Стоимость</h3>
                <span className={'field_order'} style={{fontWeight:'500'}}>{order.priceYen}¥ ({order.priceRu}₽)</span>
                <h3 className={'label_order'}>Примерный вес</h3>
                <span className={'field_order'}>{order.items.reduce((acc, item) => acc = acc+item.part.weight, 0)}</span>
                <h3 className={'label_order'}>Дата заказа</h3>
                <span className={'field_order'}>{getDate(order.date)[1]}, {getDate(order.date)[0]}</span>
                <h3 className={'label_order'}>Комментарий</h3>
                <span className={'field_order'}>{order.comment}</span>
            </div>
            <ItemsList itemsList={order.items} />
        </div>
            );
};

export default DetailedOrderItem;