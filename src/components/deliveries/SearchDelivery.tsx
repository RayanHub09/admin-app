import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from "../../hooks/redux-hooks";
import { methodsOfDelivery, statusesOfDelivery } from "../../lists/dateOfDelivery";
import { clearSearchDelivery, searchDelivery, resetSort, sortDeliveries } from "../../store/slices/deliveries";

interface IFields {
    [key: string]: boolean;
}

const initializeStatuses = (): IFields => {
    return statusesOfDelivery.reduce((acc, item) => {
        acc[item] = false;
        return acc;
    }, {} as IFields);
};

const initializeMethods = (): IFields => {
    return methodsOfDelivery.reduce((acc, item) => {
        acc[item] = false;
        return acc;
    }, {} as IFields);
};

const SearchDelivery = () => {
    const dispatch = useAppDispatch();
    const [searchNumber, setSearchNumber] = useState('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState('');
    const [statuses, setStatuses] = useState<IFields>(initializeStatuses());
    const [methods, setMethods] = useState<IFields>(initializeMethods());
    const [sortValue, setSortValue] = useState('');

    const numberInputRef = useRef<HTMLInputElement>(null);

    const searchDeliveryItem = useCallback(() => {
        const startDateInSeconds = startDate ? Math.floor(new Date(startDate).getTime() / 1000).toString() : '';
        const endDateInSeconds = endDate ? Math.floor(new Date(endDate).getTime() / 1000).toString() : '';
        dispatch(searchDelivery([searchNumber, startDateInSeconds, endDateInSeconds, statuses, methods, '']));
    }, [dispatch, searchNumber, startDate, endDate, statuses, methods]);

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSortValue(value);
        if (value === "asc") {
            dispatch(sortDeliveries(true));
        } else if (value === "desc") {
            dispatch(sortDeliveries(false));
        } else {
            dispatch(resetSort());
        }
    };

    const searchClearFields = useCallback(() => {
        dispatch(clearSearchDelivery());
        setSearchNumber('');
        setStartDate('');
        setEndDate('');
        setStatuses(initializeStatuses());
        setMethods(initializeMethods());
    }, [dispatch]);

    useEffect(() => {
        dispatch(sortDeliveries(false));
    }, [dispatch]);

    useEffect(() => {
        if (numberInputRef.current) {
            numberInputRef.current.focus();
        }
    }, []);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            searchDeliveryItem();
        }
    };

    return (
        <div className={'search_delivery_container'} onKeyDown={handleKeyDown}>
            <div className={'fields_search_container'}>
                <div className={'field_search'}>
                    <label className={'label_search'}>Номер</label>
                    <input
                        ref={numberInputRef} // Устанавливаем реф на поле "Номер"
                        value={searchNumber}
                        onChange={event => setSearchNumber(event.target.value)}
                        type={"text"}
                        onKeyDown={handleKeyDown} // Обработчик нажатия клавиши
                    />
                </div>
                <div className={'field_search'}>
                    <label className={'label_search'}>Дата формирования от </label>
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
            <div className={'statuses_container'}>
                <label className={'label_search'}>Способ доставки:</label>
                {Object.keys(methods).map((item, index) => (
                    <div className={'status_container'} key={index}>
                        <input
                            value={item}
                            checked={methods[item]}
                            onChange={() => setMethods({ ...methods, [item]: !methods[item] })}
                            type={"checkbox"} />
                        <label>{item}</label>
                    </div>
                ))}
            </div>
            <div className={'buttons_change_container'} style={{ justifyContent: "center" }}>
                <button
                    onClick={searchDeliveryItem}
                    className={'change_button'}>Найти</button>
                <button
                    onClick={searchClearFields}
                    className={'change_button'}>Сбросить</button>
            </div>
            <div className={'sort_container'}>
                <select className={'fields_sort'} onChange={handleSortChange} value={sortValue}>
                    <option value="desc">Сначала новые</option>
                    <option value="asc">Сначала старые</option>
                </select>
            </div>
        </div>
    );
};

export default SearchDelivery;
