import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {fetchCreateOrder} from "../../store/slices/orders";
import {useNavigate} from "react-router-dom";
import {pushNewMessage} from "../../store/slices/messages";
import {pushNewItems} from "../../store/slices/items";

type FormDataOrder = {
    comment: string;
    userId: string;
};

export type FormDataItem = {
    comment: string;
    markName: string;
    name: string;
    nameEn: string;
    priceRub: string;
    priceEur: number;
    priceUsd: number;
    priceYen: string;
    weight: string;
    count: string;
};

const initialStateOrder: FormDataOrder = {
    comment: '',
    userId: 'Выберите пользователя',
};

const initialStateItem: FormDataItem = {
    comment: '',
    markName: '',
    name: '',
    nameEn: '',
    priceRub: '',
    priceYen: '',
    priceUsd: 0,
    priceEur: 0,
    weight: '',
    count: ''
};

const CreateOrder = () => {
    const [eur, setEur] = useState(0);
    const [usd, setUsd] = useState(0);
    const users = useAppSelector(state => state.users.users)
    const orderNumber = Date.now().toString()
    const [formDataOrder, setFormDataOrder] = useState<FormDataOrder>(initialStateOrder);
    const [items, setItems] = useState<FormDataItem[]>([]);
    const [errorOrder, setErrorOrder] = useState('')
    const [errorItem, setErrorItem] = useState('')
    const [formDataItem, setFormDataItem] = useState<FormDataItem>(initialStateItem)
    const dispatch = useAppDispatch()
    const navigation = useNavigate()
    const [showItemFields, setShowItemFields] = useState(false)
    const status = useAppSelector(state => state.orders.status)


    const fieldsOrder = [
        {key: 'comment', name: 'Комментарий'}
    ];

    const fieldsItem = [
        {key: 'name', name: 'Наименование'},
        {key: 'nameEn', name: 'Наименование(анг.)'},
        {key: 'markName', name: 'Марка'},
        {key: 'weight', name: 'Вес(1шт.)кг'},
        {key: 'priceRub', name: 'Цена (руб.)'},
        {key: 'priceYen', name: 'Цена (йен.)'},
        {key: 'count', name: 'Кол-во товара'},
        {key: 'comment', name: 'Комментарий'}
    ]

    useEffect(() => {
        getExchangeRates(); // Получаем курсы валют при первом рендере
    }, []);

    const handleChangeItem = (key: keyof FormDataItem) => (value: string) => {
        if (key === 'weight') {
            value = value.replace(',', '.');
        }
        setFormDataItem(prev => ({ ...prev, [key]: value }));
    };

    const handleChange = (key: keyof FormDataOrder) => (value: string) => {
        setFormDataOrder(prev => ({ ...prev, [key]: value }));
    };

    const createNewOrder = () => {
        const requiredOrderFields = ['userId'];
        const isOrderEmpty = requiredOrderFields.some(field => formDataOrder[field as keyof FormDataOrder] === '');

        if (isOrderEmpty) {
            setErrorOrder('Пожалуйста, заполните все обязательные поля заказа.');
            setTimeout(() => setErrorOrder(''), 3000);
            return;
        }

        if (items.length === 0) {
            setErrorOrder('Вы не добавили ни одного товара!');
            setTimeout(() => setErrorOrder(''), 3000);
            return;
        }

        const totalCount = items.reduce((acc, item) => acc + Number(item.count), 0);
        const totalPriceRu = items.reduce((acc, item) => acc + Number(item.priceRub), 0);
        const totalPriceYen = items.reduce((acc, item) => acc + Number(item.priceYen), 0);

        setShowItemFields(false)
        console.log(formDataOrder.userId)
        dispatch(fetchCreateOrder({
            commentOrder: formDataOrder.comment,
            userId: formDataOrder.userId,
            count: totalCount,
            priceRu: totalPriceRu,
            priceYen: totalPriceYen,
            items: items,
            orderNumber: orderNumber
        })).then((action) => {
            if (fetchCreateOrder.fulfilled.match(action)) {
                const id = action.payload;
                console.log(items, id, orderNumber)
                dispatch(pushNewItems([items, orderNumber, id]));
                setFormDataOrder(initialStateOrder);
                setItems([]);
                navigation('/orders');
            } else {
                console.error("Ошибка при создании заказа:", action.error);
            }
        }).catch((error) => {
            console.error("Ошибка при создании заказа:", error);
        });



    };

    const handleAddItem = () => {
        const requiredFields = ['name', 'markName', 'weight', 'priceRub', 'priceYen', 'count'];
        const isEmpty = requiredFields.some(field => formDataItem[field as keyof FormDataItem] === '');
        const isNotNumber = (value: string) => isNaN(Number(value)) || value.trim() === '';

        if (isEmpty) {
            setErrorItem('Пожалуйста, заполните все обязательные поля товара.');
            setTimeout(() => setErrorItem(''), 3000);
            return;
        }

        if (isNotNumber(formDataItem.weight) || isNotNumber(formDataItem.priceRub) || isNotNumber(formDataItem.priceYen) || isNotNumber(formDataItem.count)) {
            setErrorItem('Введены некорректные данные!');
            setTimeout(() => setErrorItem(''), 3000);
            return;
        }

        const priceRub = Number(formDataItem.priceRub);
        const priceEur = priceRub * eur;
        const priceUsd = priceRub * usd;

        const newItem: FormDataItem = {
            ...formDataItem,
            priceEur: Number(priceEur.toFixed(2)),
            priceUsd: Number(priceUsd.toFixed(2)),
        };

        setItems(prev => [...prev, newItem]);
        setFormDataItem(initialStateItem);
        setErrorItem('');
    };

    const getExchangeRates = async () => {
        const url = `https://open.er-api.com/v6/latest/RUB`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Сеть не отвечает');
            }
            const data = await response.json();
            setEur(data.rates.EUR);
            setUsd(data.rates.USD);
        } catch (error) {
            console.error('Ошибка при получении курсов валют:', error);
        }
    };

    return (
        <div className='create_chat_form' style={{paddingBottom: '20px'}}>
            <select
                value={formDataOrder.userId}
                onChange={event => handleChange('userId')(event.target.value)}
                className='input_field'
            >
                <option disabled value={'Выберите пользователя'}>Выберете пользователя</option>
                {users.map(user => (
                    <option key={user.id} value={user.id}>
                        {user?.name} {user?.surname} {user?.patronymic}
                    </option>
                ))}
            </select>
            {fieldsOrder.map(({key, name}) => (
                <input
                    key={key}
                    type='text'
                    value={formDataOrder[key as keyof FormDataOrder]}
                    onChange={event => handleChange(key as keyof FormDataOrder)(event.target.value)}
                    placeholder={name}
                    className='input_field'
                />
            ))}
            <button
                className={'default_button'}
                onClick={() => setShowItemFields(prev => !prev)}>
                {showItemFields ? 'Скрыть поля для товара' : 'Товары'}
            </button>
            {showItemFields && (
                <>
                    <h3>Добавить товар</h3>
                    {fieldsItem.map(({key, name}) => (
                        <input
                            key={key}
                            type='text'
                            value={formDataItem[key as keyof FormDataItem]}
                            onChange={event => handleChangeItem(key as keyof FormDataItem)(event.target.value)}
                            placeholder={name}
                            className='input_field'
                        />
                    ))}
                    <button className={'change_button'} onClick={handleAddItem}>Добавить товар</button>
                    {errorItem && <span className={'error'}>{errorItem}</span>}
                    {items.length !== 0 &&
                        <>
                            <h3>Добавленные товары:</h3>
                            <div className={'items_grid'}>
                                {fieldsItem.map(({key, name}) => (
                                    <span key={key} className={'field header'}>{name}</span>
                                ))}
                                {items.map((item, index) => (
                                    <>
                                        {fieldsItem.map(({key}) => (
                                            <span key={key} className={'field'}>{item[key as keyof FormDataItem]}</span>
                                        ))}
                                    </>
                                ))}
                            </div>
                        </>
                    }
                </>
            )}
            <button
                className={'default_button'}
                onClick={createNewOrder}>
                {status === 'loading' ? 'Создание...' : 'Создать заказ'}
            </button>
            {errorOrder && <span className={'error'} style={{alignSelf: 'center'}}>{errorOrder}</span>}
        </div>
    );
};

export default CreateOrder;