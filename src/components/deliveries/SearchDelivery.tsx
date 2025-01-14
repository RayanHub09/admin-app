import React, {useCallback, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {methodsOfDelivery, statusesOfDelivery} from "../../lists/dateOfDelivery";

import {clearSearchDelivery, searchDelivery, resetSort, sortDeliveries} from "../../store/slices/deliveries";


interface IFields {
    [key: string]: boolean
}

const initializeStatuses = (): IFields => {
    return statusesOfDelivery.reduce((acc, item) => {
        acc[item] = false
        return acc
    }, {} as IFields)
}

const initializeMethods = (): IFields => {
    return methodsOfDelivery.reduce((acc, item) => {
        acc[item] = false
        return acc
    }, {} as IFields)
}

const SearchDelivery = () => {
    const dispatch = useAppDispatch()
    const isSearching = useAppSelector(state => state.deliveries.isSearching)
    const [searchNumber, setSearchNumber] = useState('')
    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState('')
    const [statuses, setStatuses] = useState<IFields>(initializeStatuses)
    const [methods, setMethods] = useState<IFields>(initializeMethods)
    const [sortValue, setSortValue] = useState('');
    const [ascending, setAscending] = useState<boolean | null>(null);

    const searchDeliveryItem = useCallback(() => {
        const startDateInSeconds = startDate ? Math.floor(new Date(startDate).getTime() / 1000).toString() : ''
        const endDateInSeconds = endDate ? Math.floor(new Date(endDate).getTime() / 1000).toString() : ''
        dispatch(searchDelivery([searchNumber, startDateInSeconds, endDateInSeconds, statuses, methods, '']))
    }, [dispatch, searchNumber, startDate, endDate, statuses, methods])
    const changeButton = () => {
        setSortValue('')
    };
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value
        setSortValue(value)
        if (value === "asc") {
            setAscending(true)
            dispatch(sortDeliveries(!ascending))
        } else if (value === "desc") {
            setAscending(false)
            dispatch(sortDeliveries(!ascending))
        } else {
            setAscending(null)
            dispatch(resetSort())
        }
    };
    const searchClearFields = useCallback(() => {
        dispatch(clearSearchDelivery())
        setSearchNumber('')
        setStartDate('')
        setEndDate('')
        setStatuses(initializeStatuses())
        setMethods(initializeMethods())
    }, [dispatch])

    return (
        <div className={'search_delivery_container'}>
                <div className={'fields_search_container'}>
                    <div className={'field_search'}>
                        <label className={'label_search'}>Номер</label>
                        <input
                            value={searchNumber}
                            onChange={event => setSearchNumber(event.target.value)}
                            type={"text"}/>
                    </div>
                    <div className={'field_search'}>
                        <label className={'label_search'}>Дата формирования от </label>
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
                <div className={'statuses_container'}>
                    <label className={'label_search'}>Способ доставки:</label>
                    {Object.keys(methods).map((item, index) =>(
                        <div className={'status_container'} key={index}>
                            <input
                                value={item}
                                checked={methods[item]}
                                onChange={() => setMethods({...methods, [item] : !methods[item]})}
                                type={"checkbox"}/>
                            <label>{item}</label>
                        </div>
                    ))}
                </div>
                <div className={'buttons_change_container'} style={{justifyContent: "center"}}>
                    <button
                        onClick={searchDeliveryItem}
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

export default SearchDelivery;