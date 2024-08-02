import React, {FC} from 'react';
import './orders.sass'
import {IOrder} from "../../interfaces";
import ItemsList from "./items/ItemsList";
import {Link} from "react-router-dom";



interface OrderItemProps {
    order: IOrder
}

const OrderItem: FC<OrderItemProps> = ({order}) => {

    function getDate(str: string): string[] {
        const date = str.split('T')[0]
        const time = str.split('T')[1].toString().slice(0, -5)
        return [time, date]
    }

    return (
        <div className={'order_item_container'}>
            <Link to={`/orders/${order.id}`} className={'link_item'} style={{alignSelf: 'flex-start', borderRadius: '10px', background: '#006bae', padding: '10px', color: 'white'}}>Заказ № {order.number}</Link>
            <div className={'order_item'}>
                <h3 className={'label_order'}>Номер</h3>
                <span className={'field_order'}>{order.number}</span>
                <h3 className={'label_order'}>Статус</h3>
                <span className={'field_order'}>{order.status.statusName}</span>
                <h3 className={'label_order'}>Кол-во товара (шт.)</h3>
                <span className={'field_order'}>{order.itemsCnt}</span>
                <h3 className={'label_order'}>Стоимость</h3>
                <span className={'field_order'} style={{fontWeight:'500'}}>{order.priceYen}¥ ({order.priceRu}₽)</span>
                <h3 className={'label_order'}>Примерный вес</h3>
                <span className={'field_order'}>{''}</span>
                <h3 className={'label_order'}>Дата заказа</h3>
                <span className={'field_order'}>{getDate(order.date)[1]}, {getDate(order.date)[0]}</span>
                <h3 className={'label_order'}>Комментарий</h3>
                <span className={'field_order'}>{order.comment}</span>
            </div>
        </div>
    );
};

export default OrderItem;