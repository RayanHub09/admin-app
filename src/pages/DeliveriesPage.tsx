import React, {useEffect} from 'react';
import DeliveriesList from "../components/deliveries/DeliveriesList";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {clearSearchDelivery} from "../store/slices/deliveries";
import SearchDelivery from "../components/deliveries/SearchDelivery";

const DeliveriesPage = () => {
    const dispatch = useAppDispatch()
    const deliveries = useAppSelector(state => state.deliveries.deliveries)
    useEffect(() => {dispatch(clearSearchDelivery())}, [])
    return (
        <div className={'deliveries_page_container'}>
            <SearchDelivery/>
            <DeliveriesList deliveries={deliveries}/>
        </div>
    );
};

export default DeliveriesPage;