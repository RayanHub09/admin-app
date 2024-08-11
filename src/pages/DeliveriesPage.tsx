import React, {useEffect} from 'react';
import DeliveriesList from "../components/deliveries/DeliveriesList";
import {useAppDispatch} from "../hooks/redux-hooks";
import {clearSearch} from "../store/slices/deliveries";

const DeliveriesPage = () => {
    const dispatch = useAppDispatch()
    useEffect(() => {dispatch(clearSearch())}, [])

    return (
        <div className={'deliveries_page_container'}>
            <DeliveriesList />
        </div>
    );
};

export default DeliveriesPage;