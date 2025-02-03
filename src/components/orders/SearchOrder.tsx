import React, { useCallback, useEffect, useRef, useState } from 'react';
import { statusOrder } from "../../lists/statusOrder";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { clearSearch, searchOrder, sortOrders, resetSort } from "../../store/slices/orders";
import ShadowWindow from "../ShadowWindow";
import {useNavigate} from "react-router-dom";

interface IStatuses {
    [key: string]: boolean;
}

const initializeStatuses = (): IStatuses => {
    return statusOrder.reduce((acc, item) => {
        acc[item] = false;
        return acc;
    }, {} as IStatuses);
};

const SearchOrder = () => {
    const dispatch = useAppDispatch()
    const navigation = useNavigate()
    const ordersLen = useAppSelector(state => state.orders.orders).length
    const [searchNumber, setSearchNumber] = useState('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState('');
    const [sortValue, setSortValue] = useState('');
    const [statuses, setStatuses] = useState<IStatuses>(initializeStatuses());
    const searchNumberRef = useRef<HTMLInputElement>(null)
    const searchOrderItem = useCallback(() => {
        const startDateInSeconds = startDate ? Math.floor(new Date(startDate).getTime() / 1000).toString() : '';
        const endDateInSeconds = endDate ? Math.floor(new Date(endDate).getTime() / 1000).toString() : '';
        dispatch(searchOrder([searchNumber, startDateInSeconds, endDateInSeconds, statuses, '']));
    }, [dispatch, searchNumber, startDate, endDate, statuses]);

    const searchClearFields = useCallback(() => {
        dispatch(clearSearch());
        setSearchNumber('');
        setStartDate('');
        setEndDate('');
        setStatuses(initializeStatuses());
    }, [dispatch]);

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSortValue(value);
        if (value === "asc") {
            dispatch(sortOrders(true));
        } else if (value === "desc") {
            dispatch(sortOrders(false));
        } else {
            dispatch(resetSort());
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            searchOrderItem();
        }
    };

    useEffect(() => {
        dispatch(sortOrders(false));
        if (searchNumberRef.current) {
            searchNumberRef.current.focus();
        }
    }, [dispatch, ordersLen]);

    return (
        <div className={'search_orders_container'} onKeyDown={handleKeyDown}>
            <div className={'fields_search_container'}>
                <div className={'field_search'}>
                    <label className={'label_search'}>Номер</label>
                    <input
                        ref={searchNumberRef}
                        value={searchNumber}
                        onChange={event => setSearchNumber(event.target.value)}
                        type={"text"} />
                </div>
                <div className={'field_search'}>
                    <label className={'label_search'}>Дата заказа от </label>
                    <input
                        value={startDate}
                        onChange={event => setStartDate(event.target.value)}
                        type={"date"} />
                </div>
                <div className={'field_search'}>
                    <label className={'label_search'}>по</label>
                    <input
                        value={endDate}
                        onChange={event => setEndDate(event.target.value)}
                        type={"date"} />
                </div>
            </div>

            <div className={'statuses_container'}>
                <label className={'label_search'}>Статус:</label>
                {Object.keys(statuses).map((item, index) => (
                    <div className={'status_container'} key={index}>
                        <input
                            value={item}
                            checked={statuses[item]}
                            onChange={() => setStatuses({ ...statuses, [item]: !statuses[item] })}
                            type={"checkbox"} />
                        <label>{item}</label>
                    </div>
                ))}
            </div>
            <div className={'buttons_change_container'} style={{ justifyContent: "center" }}>
                <button
                    onClick={searchOrderItem}
                    className={'change_button'}>Найти</button>
                <button
                    onClick={searchClearFields}
                    className={'change_button'}>Сбросить</button>
            </div>
            <div className={'sort_container'}>
                <button
                    onClick={() => navigation('/orders/create')}
                    className={'default_button'}
                    style={{border: '1px solid #006bae'}}
                >Создать заказ</button>
                <select className={'fields_sort'} onChange={handleSortChange} value={sortValue}>
                    <option value="desc">Сначала новые</option>
                    <option value="asc">Сначала старые</option>
                </select>
            </div>
        </div>
    );
};

export default SearchOrder;
