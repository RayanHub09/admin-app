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
    const searchDeliveries = useAppSelector(state => state.deliveries.filteredDeliveries)
    const isSearching = useAppSelector(state => state.deliveries.isSearching)

    function search(searchTerm:string) {
        dispatch(searchDelivery(searchTerm))
    }
    useEffect(() => {
        dispatch(clearSearchDelivery())
    }, [])

    return (

        <div className={'deliveries_list_container'}>
            {(searchDeliveries.length === 0 && isSearching)? (<NotFoundText />) :
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
            }
        </div>
    );
};

export default DeliveriesList;