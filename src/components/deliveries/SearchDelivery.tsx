import React, {useCallback, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {methodsOfDelivery, statusesOfDelivery} from "../../lists/dateOfDelivery";

import {convertStringToDate} from "../../functions/changeDate";
import {clearSearchDelivery, searchDelivery} from "../../store/slices/deliveries";

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

    const searchDeliveryItem = useCallback(() => {
        dispatch(searchDelivery([searchNumber, startDate, endDate, statuses, methods]))
    }, [dispatch, searchNumber, startDate, endDate, statuses, methods])

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
        </div>
    );
};

export default SearchDelivery;