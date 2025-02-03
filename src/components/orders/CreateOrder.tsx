import React, {useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {fetchCreateOrder} from "../../store/slices/orders";
import {useNavigate} from "react-router-dom";

type FormDataOrder = {
    comment: string;
    number: string;
    userId: string;
};

export type FormDataItem = {
    comment: string;
    numberLot: string;
    markName: string;
    name: string;
    priceRub: string;
    priceYen: string;
    weight: string;
    count : string
};

const initialStateOrder:FormDataOrder = {
    comment: '',
    number: '',
    userId: 'Выберете пользователя',
}

const initialStateItem:FormDataItem = {
    comment: '',
    numberLot: '',
    markName: '',
    name: '',
    priceRub: '',
    priceYen: '',
    weight: '',
    count: ''
}

const CreateOrder = () => {
    const users = useAppSelector(state => state.users.users)
    const ordersNumber = useAppSelector(state => state.orders.orders).map(order => order.number)
    const [formDataOrder, setFormDataOrder] = useState<FormDataOrder>(initialStateOrder);
    const [items, setItems] = useState<FormDataItem[]>([]);
    const [errorOrder, setErrorOrder] = useState('')
    const [errorItem, setErrorItem] = useState('')
    const [formDataItem, setFormDataItem] = useState<FormDataItem>(initialStateItem)
    const dispatch = useAppDispatch()
    const navigation = useNavigate()
    const [showItemFields, setShowItemFields] = useState(false)
    const status = useAppSelector(state => state.orders.status)

    const handleChangeItem = (key: keyof FormDataItem) => (value: string) => {
        setFormDataItem(prev => ({...prev, [key]: value}));
    };

    const handleChange = (key: keyof FormDataOrder) => (value: string) => {
        setFormDataOrder(prev => ({...prev, [key]: value}));
    };

    const fieldsOrder = [
        {key: 'number', name: 'Номер заказа'},
        {key: 'comment', name: 'Комментарий'}
    ];

    const fieldsItem = [
        {key: 'numberLot', name: 'Номер лота'},
        {key: 'name', name: 'Наименование'},
        {key: 'markName', name: 'Марка'},
        {key: 'weight', name: 'Вес(1шт.)кг'},
        {key: 'priceRub', name: 'Цена (руб.)'},
        {key: 'priceYen', name: 'Цена (йен.)'},
        {key: 'count', name: 'Кол-во товара'},
        {key: 'comment', name: 'Комментарий'}
    ]

    const createNewOrder = () => {
        const requiredOrderFields = ['number', 'priceRu', 'priceYen', 'userId'];
        const isOrderEmpty = requiredOrderFields.some(field => formDataOrder[field as keyof FormDataOrder] === '')

        if (isOrderEmpty) {
            setErrorOrder('Пожалуйста, заполните все обязательные поля заказа.');
            setTimeout(() => setErrorOrder(''), 3000);
            return;
        }
        if (ordersNumber.includes(formDataOrder.number)) {
            setErrorOrder('Такой номер заказа уже существует!');
            setTimeout(() => setErrorOrder(''), 3000);
            return;
        }

        if (items.length === 0) {
            setErrorOrder('Вы не добавили ни одного товара!');
            setTimeout(() => setErrorOrder(''), 3000)
            return;
        }
        const totalCount = items.reduce((acc, item) => {
            const countValue = +item.count;
            return acc + countValue;
        }, 0);

        const totalPriceRu = items.reduce((acc, item) => {
            const priceValue = +item.priceRub;
            return acc + priceValue;
        }, 0);

        const totalPriceYen = items.reduce((acc, item) => {
            const priceValue = +item.priceYen;
            return acc + priceValue;
        }, 0);
        setShowItemFields(false)
        dispatch(fetchCreateOrder({commentOrder : formDataOrder.comment, numberOrder : formDataOrder.number, userId : formDataOrder.userId, count : totalCount,
                                    priceRu : totalPriceRu, priceYen : totalPriceYen, items : items, numberLot:formDataItem.numberLot}))
            .then(() => {
                setFormDataOrder(initialStateOrder)
                setItems([])
                navigation('/orders')
            })

    };

    const handleAddItem = () => {
        const requiredFields = ['numberLot', 'name', 'markName', 'weight', 'priceRub', 'priceYen', 'count']
        const isEmpty = requiredFields.some(field => formDataItem[field as keyof FormDataItem] === '')
        const isNotNumber = (value: string) => isNaN(Number(value)) || value.trim() === ''

        if (isEmpty) {
            setErrorItem('Пожалуйста, заполните все обязательные поля товара.');
            setTimeout(() => setErrorItem(''), 3000)
            return;
        }

        if (isNotNumber(formDataItem.weight) || isNotNumber(formDataItem.priceRub) || isNotNumber(formDataItem.priceYen)
            || isNotNumber(formDataItem.count)) {
            setErrorItem('Введены некорректные данные!');
            setTimeout(() => setErrorItem(''), 3000)
            return;
        }

        setItems(prev => [...prev, formDataItem]);
        setFormDataItem(initialStateItem);
        setErrorItem('');
    };

    return (
        <div className='create_chat_form' style={{paddingBottom: '20px'}}>
            <select
                value={formDataOrder.userId}
                onChange={event => handleChange('userId')(event.target.value)}
                className='input_field'
            >
                <option disabled>Выберете пользователя</option>
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