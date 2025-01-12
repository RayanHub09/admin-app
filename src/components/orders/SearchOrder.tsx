import React, {useCallback, useState} from 'react';
import {statusOrder} from "../../lists/statusOrder";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {clearSearch, searchOrder} from "../../store/slices/orders";
import {convertStringToDate, getDate} from "../../functions/changeDate";

interface IStatuses {
    [key: string]: boolean
}

const initializeStatuses = (): IStatuses => {
    return statusOrder.reduce((acc, item) => {
        acc[item] = false
        return acc
    }, {} as IStatuses)
}



const SearchOrder = () => {
    const dispatch = useAppDispatch()
    const isSearching = useAppSelector(state => state.orders.isSearching)
    const [searchNumber, setSearchNumber] = useState('')
    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState('')
    const [statuses, setStatuses] = useState<IStatuses>(initializeStatuses)

    const searchOrderItem = useCallback(() => {
        dispatch(searchOrder([searchNumber, startDate, endDate, statuses, '']))

    }, [dispatch, searchNumber, startDate, endDate, statuses])

    const searchClearFields = useCallback(() => {
        dispatch(clearSearch())
        setSearchNumber('')
        setStartDate('')
        setEndDate('')
        setStatuses(initializeStatuses())
    }, [dispatch])


    return (
        <div className={'search_orders_container'}>
            <div className={'fields_search_container'}>
                <div className={'field_search'}>
                    <label className={'label_search'}>Номер</label>
                    <input
                        value={searchNumber}
                        onChange={event => setSearchNumber(event.target.value)}
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
                    onClick={searchOrderItem}
                    className={'change_button'} >Найти</button>
                <button
                    onClick={searchClearFields}
                    className={'change_button'}>Сбросить</button>
            </div>
        </div>
    );
};

export default SearchOrder;