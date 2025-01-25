import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import {searchItem, clearSearchItem, sortItems, resetSort} from "../../store/slices/items";
import { statusItem } from "../../lists/statusItem";

interface IStatuses {
    [key: string]: boolean;
}

const initializeStatuses = (): IStatuses => {
    return statusItem.reduce((acc, item) => {
        acc[item] = false;
        return acc;
    }, {} as IStatuses);
};

const SearchItem = () => {
    const dispatch = useAppDispatch();
    const [searchNumberOrder, setSearchNumberOrder] = useState('');
    const [searchNumberDelivery, setSearchNumberDelivery] = useState('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState('');
    const [statuses, setStatuses] = useState<IStatuses>(initializeStatuses());
    const [markName, setMarkName] = useState('');
    const [name, setName] = useState('');
    const [sortValue, setSortValue] = useState('');

    useEffect(() => {
        dispatch(clearSearchItem());
        setName('');
        setMarkName('');
        setStartDate('');
        setEndDate('');
        setSearchNumberDelivery('');
        setSearchNumberOrder('');
        setStatuses(initializeStatuses());
        setSortValue('');
    }, [dispatch]);


    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value
        setSortValue(value)
        if (value === "asc") {
            dispatch(sortItems(true))
        } else if (value === "desc") {
            dispatch(sortItems(false))
        } else {
            dispatch(resetSort())
        }
    };

    const searchItemF = useCallback(() => {
        const startDateInSeconds = startDate ? Math.floor(new Date(startDate).getTime() / 1000).toString() : '';
        const endDateInSeconds = endDate ? Math.floor(new Date(endDate).getTime() / 1000).toString() : '';
        dispatch(searchItem([searchNumberOrder, searchNumberDelivery, markName, name, startDateInSeconds, endDateInSeconds, statuses, '']));
    }, [dispatch, searchNumberOrder, searchNumberDelivery, markName, name, startDate, endDate, statuses]);

    const searchClearFields = useCallback(() => {
        dispatch(clearSearchItem());
        setName('');
        setMarkName('');
        setStartDate('');
        setEndDate('');
        setSearchNumberDelivery('');
        setSearchNumberOrder('');
        setStatuses(initializeStatuses());
    }, [dispatch]);

    return (
        <div className={'search_items_container'}>
            <div className={'fields_search_container'}>
                <div className={'field_search'}>
                    <label className={'label_search'}>Номер заказа</label>
                    <input
                        value={searchNumberOrder}
                        onChange={event => setSearchNumberOrder(event.target.value)}
                        type={"text"} />
                </div>
                <div className={'field_search'}>
                    <label className={'label_search'}>Номер посылки</label>
                    <input
                        value={searchNumberDelivery}
                        onChange={event => setSearchNumberDelivery(event.target.value)}
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
                <div className={'field_search'}>
                    <label className={'label_search'}>Производитель</label>
                    <input
                        value={markName}
                        onChange={event => setMarkName(event.target.value)}
                        type={"text"} />
                </div>
                <div className={'field_search'}>
                    <label className={'label_search'}>Наименование</label>
                    <input
                        value={name}
                        onChange={event => setName(event.target.value)}
                        type={"text"} />
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
                    onClick={searchItemF}
                    className={'change_button'}>Найти</button>
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

            </div>
        </div>
    );
};

export default SearchItem;