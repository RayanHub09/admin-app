import React from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import OrderItem from "./OrderItem";
import Loading from "../Loading";
import {searchOrder} from "../../store/slices/orders";
import SearchOrder from "./SearchOrder";
import {IReOrder} from "../../interfaces";
import NotFoundText from "../NotFoundText";

const OrdersList = () => {
    const dispatch = useAppDispatch()
    const orders = useAppSelector(state => state.orders.orders)
    const filtered_orders = useAppSelector(state => state.orders.filteredOrders)
    const isSearching = useAppSelector(state => state.orders.isSearching)
    const status = useAppSelector(state => state.orders.statusGet)


    return (
        <div className={'orders_list_container'}>


                <>
                    {isSearching ?
                        filtered_orders.length !== 0 ?
                            filtered_orders.map((item) => (
                                <OrderItem key={item.id} order={item as IReOrder}/>
                            ))
                            : (<NotFoundText />) :
                        orders.map((item) => (
                            <OrderItem key={item.id} order={item as IReOrder}/>
                        ))
                    }
                </>
        </div>
    )
};

export default OrdersList;