import React, {useCallback, useEffect, useState} from 'react';
import {statusOrder} from "../../lists/statusOrder";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {clearSearch, searchOrder, sortOrders, resetSort} from "../../store/slices/orders";

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
    const isSorting = useAppSelector(state => state.orders.paramSort)
    const [searchNumber, setSearchNumber] = useState('')
    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState('')
    const [ascending, setAscending] = useState<boolean | null>(null);
    const [sortValue, setSortValue] = useState('');
    const [statuses, setStatuses] = useState<IStatuses>(initializeStatuses)

    const searchOrderItem = useCallback(() => {
        const startDateInSeconds = startDate ? Math.floor(new Date(startDate).getTime() / 1000).toString() : ''
        const endDateInSeconds = endDate ? Math.floor(new Date(endDate).getTime() / 1000).toString() : ''
        dispatch(searchOrder([searchNumber, startDateInSeconds, endDateInSeconds, statuses, '']))

    }, [dispatch, searchNumber, startDate, endDate, statuses])

    const searchClearFields = useCallback(() => {
        dispatch(clearSearch())
        setSearchNumber('')
        setStartDate('')
        setEndDate('')
        setStatuses(initializeStatuses())
    }, [dispatch])


    const changeButton = () => {
        setSortValue('')
    };
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value
        setSortValue(value)
        if (value === "asc") {
            setAscending(true)
            dispatch(sortOrders(!ascending))
        } else if (value === "desc") {
            setAscending(false)
            dispatch(sortOrders(!ascending))
        } else {
            setAscending(null)
            dispatch(resetSort())
        }
    };

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
            <div className={'sort_container'}>
                <select className={'fields_sort'} onChange={handleSortChange} value={sortValue}>
                    <option value="" disabled>Выбрать сортировку</option>
                    <option value="asc">Сначала старые</option>
                    <option value="desc">Сначала новые</option>
                </select>
                <button
                    onClick={changeButton}
                    className={'default_button'}
                    disabled={sortValue === ''}>
                    Сбросить
                </button>
            </div>
        </div>
    );
};

export default SearchOrder;