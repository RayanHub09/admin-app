import React, {useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {statusOrder} from "../../lists/statusOrder";

interface IStatuses {
    [key: string]: boolean
}

const initializeStatuses = (): IStatuses => {
    return statusOrder.reduce((acc, item) => {
        acc[item] = false
        return acc
    }, {} as IStatuses)
}

const SearchItem = () => {
    const dispatch = useAppDispatch()
    const isSearching = useAppSelector(state => state.orders.isSearching)
    const [searchNumberOrder, setSearchNumberOrder] = useState('')
    const [searchNumberDelivery, setSearchNumberDelivery] = useState('')
    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState('')
    const [statuses, setStatuses] = useState<IStatuses>(initializeStatuses)

    return (
        <div className={'search_items_container'}>
            <div className={'fields_search_container'}>
                <div className={'field_search'}>
                    <label className={'label_search'}>Номер заказа</label>
                    <input
                        value={searchNumberOrder}
                        onChange={event => setSearchNumberOrder(event.target.value)}
                        type={"text"}/>
                </div>
                <div className={'field_search'}>
                    <label className={'label_search'}>Номер посылки</label>
                    <input
                        value={searchNumberDelivery}
                        onChange={event => setSearchNumberDelivery(event.target.value)}
                        type={"text"}/>
                </div>

                <div className={'field_search'}>
                    <label className={'label_search'}>Дата заказа от </label>
                    <input
                        value={startDate}
                        onChange={event => setStartDate(event.target.value)}
                        type={"date"}/>
                </div>
                <div className={'field_search'}>
                    <label className={'label_search'}>по</label>
                    <input
                        value={endDate}
                        onChange={event => setEndDate(event.target.value)}
                        type={"date"}/>
                </div>
                <div className={'field_search'}>
                    <label className={'label_search'}>Производитель</label>
                    <input
                        // value={searchNumberOrder}
                        // onChange={event => setSearchNumberOrder(event.target.value)}
                        type={"text"}/>
                </div>
                <div className={'field_search'}>
                    <label className={'label_search'}>Наименование</label>
                    <input
                        // value={searchNumberDelivery}
                        // onChange={event => setSearchNumberDelivery(event.target.value)}
                        type={"text"}/>
                </div>
            </div>

            <div className={'statuses_container'}>
                <label className={'label_search'}>Статус:</label>
                {Object.keys(statuses).map((item, index) =>(
                    <div className={'status_container'} key={index}>
                        <input
                            value={item}
                            checked={statuses[item]}
                            onChange={() => setStatuses({...statuses, [item] : !statuses[item]})}
                            type={"checkbox"}/>
                        <label>{item}</label>
                    </div>
                ))}
            </div>
            <div className={'buttons_change_container'} style={{justifyContent: "center"}}>
                <button
                    // onClick={searchOrderItem}
                    className={'change_button'} >Найти</button>
                <button
                    // onClick={searchClearFields}
                    disabled={! isSearching}
                    className={'change_button'}>Сбросить</button>
            </div>
        </div>
    );
};

export default SearchItem;