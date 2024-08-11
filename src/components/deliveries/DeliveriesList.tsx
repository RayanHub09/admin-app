import React from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import DeliveryItem from "./DeliveryItem";
import './deliveries.sass'
import Search from "../Search";
import {searchDelivery} from "../../store/slices/deliveries";

const DeliveriesList = () => {
    const dispatch = useAppDispatch()
    const deliveries = useAppSelector(state => state.deliveries.deliveries)
    const searchDeliveries = useAppSelector(state => state.deliveries.filteredDeliveries)
    const isSearching = useAppSelector(state => state.deliveries.isSearching)

    function search(searchTerm:string) {
        dispatch(searchDelivery(searchTerm))
    }

    return (

        <div className={'deliveries_list_container'}>
            <Search funcSearch={search} />
            <div className={'deliveries_list'}>

                <h3 className={'label_order'}>Номер</h3>
                <h3 className={'label_order'}>Способ</h3>
                <h3 className={'label_order'}>Статус</h3>
                <h3 className={'label_order'}>Время создания</h3>
                <h3 className={'label_order'}>Стоимость доставки</h3>
                <h3 className={'label_order'}>Стоимость товара</h3>
                <h3 className={'label_order'}>Кол-во</h3>
                {isSearching
                    ?
                    searchDeliveries.map(delivery =>
                        <DeliveryItem delivery={delivery} key={delivery.id} />)
                    :
                    deliveries.map(delivery =>
                        <DeliveryItem delivery={delivery} key={delivery.id} />)
                }
            </div>
        </div>
    );
};

export default DeliveriesList;