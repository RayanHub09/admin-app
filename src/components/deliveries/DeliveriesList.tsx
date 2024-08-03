import React from 'react';
import {useAppSelector} from "../../hooks/redux-hooks";

const DeliveriesList = () => {
    const deliveries = useAppSelector(state => state.deliveries.deliveries)
    return (
        <div className={'deliveries_list_container'}>
            <h3>Номер</h3>
            <h3>Способ</h3>
            <h3>Статус</h3>
            <h3>Время создания</h3>
            <h3>Стоимость доставки</h3>
            <h3>Стоимость товара</h3>
            <h3>Кол-во</h3>
        </div>
    );
};

export default DeliveriesList;