import React from 'react';
import {useAppSelector} from "../../hooks/redux-hooks";
import OrderItem from "./OrderItem";
import Search from "../Search";

const OrdersList = () => {
    const orders = useAppSelector(state => state.orders.orders)
    const filtered_orders = useAppSelector(state => state.orders.filteredOrders)
    const isSearching = useAppSelector(state => state.orders.isSearching)

    return (
        <div className={'orders_list_container'}>
            <Search/>
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
    );
};

export default OrdersList;