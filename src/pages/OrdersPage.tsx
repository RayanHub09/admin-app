import React, {useEffect} from 'react';
import OrdersList from "../components/orders/OrdersList";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {clearSearch} from "../store/slices/orders";
import SearchOrder from "../components/orders/SearchOrder";
import Loading from "../components/Loading";


const OrdersPage = () => {
    const status = useAppSelector(state => state.orders.statusGet)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(clearSearch())
    }, [])

    return (
        <div className={'orders_page_container'}>
            {status === 'loading' &&
                <div className={'container'}>
                    {status === 'loading' && <Loading />}
                </div>
            }
            {(status === 'succeeded' || status === null) &&
                <>
                    <SearchOrder/>
                    <OrdersList />
                </>
            }
        </div>
    )
};

export default OrdersPage;