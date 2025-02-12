import React, {FC, useEffect, useState} from 'react';
import {IDelivery, IOrder, IUser} from "../../interfaces";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import DeliveriesList from "../deliveries/DeliveriesList";
import OrderGrid from "../orders/OrderGrid";
import {clearSearch, searchOrder} from "../../store/slices/orders";
import NotFoundText from "../NotFoundText";
import {clearSearchDelivery, searchDelivery} from "../../store/slices/deliveries";
import {clearSearchItem, searchItem} from "../../store/slices/items";
import Item from "../items/Item";
import {fetchDeleteUser} from "../../store/slices/users";
import {useNavigate} from "react-router-dom";
import ShadowWindow from "../ShadowWindow";
import {changeCost} from "../../functions/changeCost";
import {getDate} from "../../functions/changeDate";

interface DetailedUserItemProps {
    user: IUser
}

const DetailedUserItem: FC<DetailedUserItemProps> = ({user}) => {
    const manager = useAppSelector(state => state.manager.manager)
    const deliveries = useAppSelector(state => state.deliveries.deliveries).filter(delivery => delivery.uid === user.id)
    const sum_deliveries_yen = deliveries.reduce((acc, delivery) => (acc += (delivery.deliveryCostYen ? delivery.deliveryCostYen : 0)), 0)
    const sum_deliveries_ru = deliveries.reduce((acc, delivery) => (acc += (delivery.deliveryCost ? delivery.deliveryCost : 0)), 0)
    const sortedDeliveries = deliveries.sort((a:IDelivery, b:IDelivery) => +a?.creationDate - +b?.creationDate)
    const filteredDeliveries = useAppSelector(state => state.deliveries.filteredDeliveries)
    const isSearchingDelivery = useAppSelector(state => state.deliveries.isSearching)
    const orders = useAppSelector(state => state.orders.orders).filter(order => order.uid === user.id)
    const sum_items_yen = orders.reduce((acc, order) => (acc += (order.priceYen ? order.priceYen : 0)), 0)
    const sum_items_ru = orders.reduce((acc, order) => (acc += (order.priceRu ? order.priceRu : 0)), 0)
    const filteredOrders = useAppSelector(state => state.orders.filteredOrders)
    const sortedOrders = orders.sort((a:IOrder, b:IOrder) => +a.date - +b.date)
    const isSearchingOrder = useAppSelector(state => state.orders.isSearching)
    const items = useAppSelector(state => state.items.items).filter(item => item.uid === user.id)
    const filteredItems = useAppSelector(state => state.items.filteredItems)
    const isSearchingItems = useAppSelector(state => state.items.isSearching)
    const [numberOrder, setNumberOrder] = useState('')
    const [numberDelivery, setNumberDelivery] = useState('')
    const [name, setName] = useState('')
    const navigation = useNavigate()
    const [markName, setMarkName] = useState('')
    const dispatch = useAppDispatch()
    const [visibleWindowDelete, setVisibleWindowDelete] = useState(false)
    const [visibleWindowSendMessage, setVisibleWindowSendMessage    ] = useState(false)
    const statusDeleteUser = useAppSelector(state => state.users.statusDelete)

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

    function deleteUser() {
        dispatch(fetchDeleteUser({user_id: user.id}))
            .then(() => navigation('/users'))
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
            <div className={'statistic_container'}>
                <h2>Статистика покупателя</h2>
                <div className={'statistic_grid'}>
                    <span className={'field'}>Общая сумма посылок</span>
                    <span className={'field'}>{changeCost(sum_deliveries_yen.toString())}¥ ({changeCost(sum_deliveries_ru.toString())}₽)</span>
                    <span className={'field'}>Общая сумма товаров</span>
                    <span className={'field'}>{changeCost(sum_items_yen.toString())}¥ ({changeCost(sum_items_ru.toString())}₽)</span>
                    <span className={'field'}>Дата последнего заказа</span>
                    {orders.length === 0 ? <span className={'field'}></span> :
                        <span className={'field'}>{getDate(sortedOrders[sortedOrders.length - 1].date)[0]}</span>}
                </div>
            </div>
            <div className={'buttons_change_container'}>
                {(manager.role === 'admin' || manager.writeCommentsDelivery) && <button
                    onClick={() => setVisibleWindowSendMessage(true)}
                    className={'change_button'}
                >Написать сообщение
                </button>}
                {<button
                    onClick={() => setVisibleWindowDelete(true)}
                    className={'error_button'}
                    style={{alignSelf: 'flex-start'}}
                >Удалить покупателя
                </button>}
            </div>
            {visibleWindowDelete &&
                <ShadowWindow
                    text={`Вы уверены, что хотите удалить пользователя ${user.name} ${user.surname} ${user.patronymic}?`}
                    onClose={() => setVisibleWindowDelete(false)}
                    deleteFunc={deleteUser}
                    status={statusDeleteUser}/>
            }
            {visibleWindowSendMessage &&
                <ShadowWindow
                    text={'Создание чата'}
                    create={true}
                    uid={user.id}
                    onClose={() => setVisibleWindowSendMessage(false)}
                    status={''} />
            }
            <div className={'container_list_del_user'}>
                <div className={'fields_search'}>
                    <h3 className={'title'}>Список посылок</h3>
                    {deliveries.length !== 0 &&
                        <div className={'fields_search'}>
                            <input
                                style={{alignSelf: "center"}}
                                value={numberDelivery}
                                onChange={event => setNumberDelivery(event.target.value)}
                                placeholder={'Номер посылки'}/>
                            <button
                                style={{alignSelf: "center"}}
                                disabled={!numberDelivery}
                                onClick={searchingDelivery}
                                className={'default_button'}>Найти
                            </button>
                            <button
                                onClick={clearFieldsSearchDelivery}
                                className={'default_button'}>Сбрость
                            </button>
                        </div>}
                </div>
                {filteredDeliveries.length !== 0 ?
                    orders.length !== 0 ?
                        <DeliveriesList deliveries={filteredDeliveries}/> :
                        <span className={'nothing_found'}>Пока нет посылок</span>
                    :
                    (isSearchingDelivery ? (<NotFoundText/>) : deliveries.length !== 0 ?
                        <DeliveriesList deliveries={deliveries}/> :
                        <span className={'nothing_found'}>Пока нет посылок</span>)
                }
            </div>
            <div className={'container_list_del_user'}>
                <div className={'fields_search'}>
                    <h3 className={'title'}>Список заказов</h3>
                    {orders.length !== 0 &&
                        <div className={'fields_search'}>
                            <input
                                value={numberOrder}
                                style={{alignSelf: "center"}}
                                onChange={event => setNumberOrder(event.target.value)}
                                placeholder={'Номер заказа'}/>
                            <button
                                onClick={searchingOrder}
                                disabled={!numberOrder}
                                style={{alignSelf: "center"}}
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
                    (isSearchingOrder ? (<NotFoundText/>) : orders.length !== 0 ?
                        <OrderGrid orders={orders}/> :
                        <span className={'nothing_found'}>Пока нет заказов</span>)
                }
            </div>

            <div className={'container_list_del_user'}>
                <div className={'fields_search'}>
                    <h3 className={'title'}>Список товаров</h3>
                    {items.length !== 0 &&
                        <div className={'fields_search'}>
                            <input
                                style={{alignSelf: "center"}}
                                value={markName}
                                onChange={event => setMarkName(event.target.value)}
                                placeholder={'Производитель'}/>
                            <input
                                style={{alignSelf: "center"}}
                                value={name}
                                onChange={event => setName(event.target.value)}
                                placeholder={'Наименование'}/>
                            <button
                                style={{alignSelf: "center"}}
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
                    {(filteredItems.length === 0 && isSearchingItems) ? (<NotFoundText/>) :
                        (items.length !== 0 ?
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
                            </div> : <span className={'nothing_found'}>Пока нет товаров</span>)
                    }
                </div>
            </div>

        </div>
    );
};

export default DetailedUserItem;