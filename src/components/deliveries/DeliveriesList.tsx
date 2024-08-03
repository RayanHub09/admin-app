import React from 'react';
import {useAppSelector} from "../../hooks/redux-hooks";
import DeliveryItem from "./DeliveryItem";
import './deliveries.sass'

const DeliveriesList = () => {
    const deliveries = useAppSelector(state => state.deliveries.deliveries)
    return (
        <div className={'deliveries_list_container'}>
            <h3 className={'label_order'}>Номер</h3>
            <h3 className={'label_order'}>Способ</h3>
            <h3 className={'label_order'}>Статус</h3>
            <h3 className={'label_order'}>Время создания</h3>
            <h3 className={'label_order'}>Стоимость доставки</h3>
            <h3 className={'label_order'}>Стоимость товара</h3>
            <h3 className={'label_order'}>Кол-во</h3>
            {deliveries.map(delivery =>
                <DeliveryItem delivery={delivery} key={delivery.id} />
            )}
        </div>
    );
};

export default DeliveriesList;