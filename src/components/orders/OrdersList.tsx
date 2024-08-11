import React from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import OrderItem from "./OrderItem";
import Search from "../Search";
import Loading from "../Loading";
import {searchOrder} from "../../store/slices/orders";

const OrdersList = () => {
    const dispatch = useAppDispatch()
    const orders = useAppSelector(state => state.orders.orders)
    const filtered_orders = useAppSelector(state => state.orders.filteredOrders)
    const isSearching = useAppSelector(state => state.orders.isSearching)
    const status = useAppSelector(state => state.orders.statusGet)

    function search(searchTerm:string) {
        dispatch(searchOrder(searchTerm))
    }

    return (
        <>
            {status === 'loading' &&
                <div className={'container'}>
                    {status === 'loading' && <Loading />}
                </div>
            }
            {status === 'succeeded' &&
                <div className={'orders_list_container'}>
                    <Search funcSearch={search}/>
                    {isSearching ?
                        filtered_orders.length !== 0 ?
                            filtered_orders.map((item) => (
                                <OrderItem key={item.id} order={item}/>
                            ))
                            : (<h2 className={'nothing_found'}>Ничего не найдено.<br/><br/>Проверьте номер заказа <br/> и попробуйте еще раз.</h2>)
                        :
                        orders.map((item) => (
                            <OrderItem key={item.id} order={item}/>
                        ))
                    }
                </div>
            }
        </>
    )
};

export default OrdersList;