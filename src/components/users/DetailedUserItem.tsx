import React, {FC, useEffect, useState} from 'react';
import {IDelivery, IReItem, IUser} from "../../interfaces";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import DeliveriesList from "../deliveries/DeliveriesList";
import OrderGrid from "../orders/OrderGrid";
import {clearSearch, searchOrder} from "../../store/slices/orders";
import NotFoundText from "../NotFoundText";
import {clearSearchDelivery, searchDelivery} from "../../store/slices/deliveries";
import {clearSearchItem, searchItem} from "../../store/slices/items";
import ItemsList from "../items/ItemsList";
import Item from "../items/Item";

interface DetailedUserItemProps {
    user: IUser
}

const DetailedUserItem: FC<DetailedUserItemProps> = ({user}) => {
    const deliveries = useAppSelector(state => state.deliveries.deliveries).filter(delivery => delivery.uid === user.id)
    const filteredDeliveries = useAppSelector(state => state.deliveries.filteredDeliveries)
    const isSearchingDelivery = useAppSelector(state => state.deliveries.isSearching)
    const orders = useAppSelector(state => state.orders.orders).filter(order => order.uid === user.id)
    const filteredOrders = useAppSelector(state => state.orders.filteredOrders)
    const isSearchingOrder = useAppSelector(state => state.orders.isSearching)
    const items = useAppSelector(state => state.items.items).filter(item => item.uid === user.id)
    const filteredItems = useAppSelector(state => state.items.filteredItems)
    const isSearchingItems = useAppSelector(state => state.items.isSearching)
    const [numberOrder, setNumberOrder] = useState('')
    const [numberDelivery, setNumberDelivery] = useState('')
    const [name, setName] = useState('')
    const [markName, setMarkName] = useState('')
    const dispatch = useAppDispatch()

    useEffect(() => {
        setName('')
        setMarkName('')
        setNumberDelivery('')
        setNumberOrder('')
        dispatch(clearSearch())
        dispatch(clearSearchItem())
        dispatch(clearSearchDelivery())
    }, [])

    function searchingOrder() {
        dispatch(searchOrder([numberOrder, '', '', '', user.id]))
    }

    function clearFieldsSearchOrder() {
        dispatch(clearSearch())
        setNumberOrder('')
    }

    function searchingDelivery() {
        dispatch(searchDelivery([numberDelivery, '', '', '', '', user.id]))
    }

    function clearFieldsSearchDelivery() {
        dispatch(clearSearchDelivery())
        setNumberDelivery('')
    }

    function searchingItem() {
        console.log(markName, name)
        dispatch(searchItem(['', '', markName, name, '', '', '', user.id]))
    }

    function clearFieldsSearchItem() {
        dispatch(clearSearchItem())
        setMarkName('')
        setName('')
    }
    return (
        <div className={'detailed_user_item_container'}>
            <div className={'user_information'}>
                <span style={{fontWeight: 'bold'}}>ID</span>
                <span>{user.id}</span>
                <span style={{fontWeight: 'bold'}}>ФИО</span>
                <span>{user.name} {user.surname} {user.patronymic}</span>
                <span style={{fontWeight: 'bold'}}>Email</span>
                <span>{user.email}</span>
                <span style={{fontWeight: 'bold'}}>Номер телефонв</span>
                <span>{user.phoneNumber}</span>
                <span style={{fontWeight: 'bold'}}>Страна</span>
                <span>{user.country}</span>
            </div>
            <div className={'container_list_del_user'}>


            </div>
            <div className={'container_list_del_user'}>
                <div className={'fields_search'}>
                    <h3 className={'title'}>Список посылок</h3>
                    {deliveries.length !== 0 &&
                        <div className={'fields_search'}>
                            <input
                                value={numberDelivery}
                                onChange={event => setNumberDelivery(event.target.value)}
                                placeholder={'Номер посылки'}/>
                            <button
                                disabled={!numberDelivery}
                                onClick={searchingDelivery}
                                className={'default_button'}>Найти</button>
                            <button
                                onClick={clearFieldsSearchDelivery}
                                className={'default_button'}>Сбрость</button>
                        </div>}
                </div>
                {filteredDeliveries.length !== 0 ?
                    orders.length !== 0 ?
                        <DeliveriesList deliveries={filteredDeliveries}/> :
                        <span className={'nothing_found'}>Пока нет посылок</span>
                    :
                    (isSearchingDelivery ? (<NotFoundText />) : deliveries.length !== 0 ?
                        <DeliveriesList deliveries={deliveries}/> :
                        <span className={'nothing_found'}>Пока нет посылок</span>   )
                }
            </div>
            <div className={'container_list_del_user'}>
                <div className={'fields_search'}>
                    <h3 className={'title'}>Список заказов</h3>
                    {orders.length !== 0 &&
                        <div className={'fields_search'}>
                            <input
                                value={numberOrder}
                                onChange={event => setNumberOrder(event.target.value)}
                                placeholder={'Номер заказа'}/>
                            <button
                                onClick={searchingOrder}
                                disabled={!numberOrder}
                                className={'default_button'}>
                                Найти
                            </button>
                            <button
                                onClick={clearFieldsSearchOrder}
                                className={'default_button'}>
                                Сбросить
                            </button>
                        </div>}
                </div>
                {filteredOrders.length !== 0 ?
                    orders.length !== 0 ?
                            <OrderGrid orders={filteredOrders}/> :
                            <span className={'nothing_found'}>Пока нет заказов</span>

                :
                    (isSearchingOrder ? (<NotFoundText />) : orders.length !== 0 ?
                        <OrderGrid orders={orders}/> :
                        <span className={'nothing_found'}>Пока нет заказов</span>   )
                    }
            </div>

            <div className={'container_list_del_user'}>
                <div className={'fields_search'}>
                    <h3 className={'title'}>Список товаров</h3>
                    {items.length !== 0 &&
                        <div className={'fields_search'}>
                            <input
                                value={markName}
                                onChange={event => setMarkName(event.target.value)}
                                placeholder={'Производитель'}/>
                            <input
                                value={name}
                                onChange={event => setName(event.target.value)}
                                placeholder={'Наименование'}/>
                            <button
                                onClick={searchingItem}
                                disabled={!markName && !name}
                                className={'default_button'}>
                                Найти
                            </button>
                            <button
                                onClick={clearFieldsSearchItem}
                                className={'default_button'}>
                                Сбросить
                            </button>
                        </div>}
                </div>
                <div className={'items_list_all_container'}>
                    {(filteredItems.length == 0 && isSearchingItems) ? (<NotFoundText />) :
                        <div className={'items_list'}>
                            <h4 className={'label_order'}>Наменование</h4>
                            <h4 className={'label_order'}>Производитель</h4>
                            <h4 className={'label_order'}>Цена(1шт.)</h4>
                            <h4 className={'label_order'}>Вес(1шт.)</h4>
                            <h4 className={'label_order'}>Кол-во</h4>
                            <h4 className={'label_order'}>Номер заказа</h4>
                            <h4 className={'label_order'}>Номер посылки</h4>
                            <h4 className={'label_order'}>Покупатель</h4>
                            <h4 className={'label_order'}>Комментарий</h4>
                            {isSearchingItems
                                ?
                                filteredItems.map((item, index) => (
                                    <Item item={item} key={index}/>
                                ))
                                :
                                items.map((item, index) => (
                                    <Item item={item} key={index}/>
                                ))
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default DetailedUserItem;