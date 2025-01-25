import React, {FC, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import DeliveryItem from "./DeliveryItem";
import './deliveries.sass'
import {clearSearchDelivery, searchDelivery} from "../../store/slices/deliveries";
import {IDelivery} from "../../interfaces";
import NotFoundText from "../NotFoundText";

interface DeliveriesListProps {
    deliveries: IDelivery[]
}
const DeliveriesList:FC<DeliveriesListProps> = ({deliveries}) => {
    const dispatch = useAppDispatch()
    const sortedDeliveries = useAppSelector(state => state.deliveries.sortedDeliveries)
    const filteredSortedDeliveries = useAppSelector(state => state.deliveries.filteredSortedDeliveries)
    const filteredDeliveries = useAppSelector(state => state.deliveries.filteredDeliveries)
    const isSearching = useAppSelector(state => state.deliveries.isSearching)
    const isSorting = useAppSelector(state => state.deliveries.isSorting)

    useEffect(() => {
        dispatch(clearSearchDelivery())
    }, [])

    if (deliveries.length === 0) {
        return <div className={'container'} style={{fontSize: '30px'}}>Пока нет доставок</div>
    }

    return (
        <div className={'deliveries_list_container'}>
            {(filteredDeliveries.length === 0 && isSearching) ? (<NotFoundText />) :
                <div className={'deliveries_list'}>
                    <h3 className={'label_order'}>Номер</h3>
                    <h3 className={'label_order'}>Время создания</h3>
                    <h3 className={'label_order'}>Способ доставки</h3>
                    <h3 className={'label_order'}>Стоимость товара</h3>
                    <h3 className={'label_order'}>Кол-во</h3>
                    <h3 className={'label_order'}>Стоимость доставки</h3>
                    <h3 className={'label_order'}>Статус</h3>
                    <h3 className={'label_order'}>Комментарий</h3>
                    {isSearching
                        ? (isSorting ? filteredSortedDeliveries.map(delivery =>
                            <DeliveryItem delivery={delivery} key={delivery.id} />) : filteredDeliveries.map(delivery =>
                            <DeliveryItem delivery={delivery} key={delivery.id} />))
                        :
                        (isSorting ? sortedDeliveries.map(delivery =>
                            <DeliveryItem delivery={delivery} key={delivery.id} />) : deliveries.map(delivery =>
                            <DeliveryItem delivery={delivery} key={delivery.id} />))
                    }
                </div>
            }
        </div>
    );
};

export default DeliveriesList;