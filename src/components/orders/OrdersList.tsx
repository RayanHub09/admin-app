import React from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import OrderItem from "./OrderItem";
import {IReOrder} from "../../interfaces";
import NotFoundText from "../NotFoundText";

const OrdersList = () => {
    const dispatch = useAppDispatch()
    const orders = useAppSelector(state => state.orders.orders)
    const filtered_orders = useAppSelector(state => state.orders.filteredOrders)
    const sortedOrders = useAppSelector(state => state.orders.sortedOrders)
    const isSearching = useAppSelector(state => state.orders.isSearching)
    const isSorting = useAppSelector(state => state.orders.isSorting)
    const filteredSortedOrders = useAppSelector(state => state.orders.filteredSortedOrders)


    return (
        <div className={'orders_list_container'}>
                <>
                    {(isSearching && filtered_orders.length === 0) ?
                        <NotFoundText /> :
                        isSearching ?
                            (isSorting ? filteredSortedOrders.map((item, index) => (
                            <OrderItem key={item.id} index={index} order={item as IReOrder}/>
                        )) :  filtered_orders.map((item, index) => (
                            <OrderItem key={item.id} index={index} order={item as IReOrder}/>
                        )))
                            : (isSorting ? sortedOrders.map((item, index) => (
                                <OrderItem key={item.id} index={index} order={item as IReOrder}/>
                            )) : orders.map((item, index) => (
                                <OrderItem key={item.id} index={index} order={item as IReOrder}/>
                            )))
                    }
                </>

        </div>
    )
};

export default OrdersList;