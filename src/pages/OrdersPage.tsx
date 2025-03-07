import React, {useEffect} from 'react';
import OrdersList from "../components/orders/OrdersList";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {clearSearch, sortOrders} from "../store/slices/orders";
import SearchOrder from "../components/orders/SearchOrder";
import Loading from "../components/Loading";


const OrdersPage = () => {
    const status_orders = useAppSelector(state => state.orders.statusGet)
    const status_deliveries = useAppSelector(state => state.deliveries.statusGet)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(clearSearch())
    }, [])

    return (
        <div className={'orders_page_container'}>
            {(status_orders === 'loading' || status_deliveries === 'loading') &&
                <div className={'container'}>
                    {<Loading />}
                </div>
            }
            {(status_orders === 'succeeded' || status_orders === null) &&
                (status_deliveries === 'succeeded' || status_deliveries === null) &&
                <>
                    <SearchOrder/>
                    <OrdersList />
                </>
            }
        </div>
    )
};

export default OrdersPage;