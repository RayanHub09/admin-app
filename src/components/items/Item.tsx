import React, { FC } from 'react';
import { IItem, IReItem } from "../../interfaces";
import './items.sass';
import { changeCost } from "../../functions/changeCost";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux-hooks";

interface IItemProps {
    item: IReItem & IItem;
    index: number
}

const Item: FC<IItemProps> = ({ item , index}) => {
    const uid = useAppSelector(state => state.orders.orders).find(order => order.number === item.numberOrder)?.uid;
    const user = useAppSelector(state => state.users.users).find(user => user.id === uid);

    if (!item.id) {
        return <></>; // Обработка отсутствия item
    }

    return (
        <>
            <span className={index % 2 === 0 ? 'field' : 'field gray_field'}>{item.id}</span>
            <span className={index % 2 === 0 ? 'field' : 'field gray_field'}>{item.part?.markName}</span>
            <span className={index % 2 === 0 ? 'field' : 'field gray_field'}>
                <h4>{changeCost(item.part?.priceYen.toString())}¥</h4>
                {changeCost(item.part?.priceRub.toString())}₽
            </span>
            <span className={index % 2 === 0 ? 'field' : 'field gray_field'}>{item.part?.weight}</span>
            <span className={index % 2 === 0 ? 'field' : 'field gray_field'}>{item.amount}</span>

            {item.idOrder ? (
                <Link className={index % 2 === 0 ? 'field' : 'field gray_field'} to={`/orders/${item.idOrder}`}>
                    <span>{item.numberOrder}</span>
                </Link>
            ) : (
                <span className={index % 2 === 0 ? 'field' : 'field gray_field'}></span>
            )}

            {item.idDelivery ? (
                <Link className={index % 2 === 0 ? 'field' : 'field gray_field'} to={`/deliveries/${item.idDelivery}`}>
                    <span>{item.numberDelivery}</span>
                </Link>
            ) : (
                <span className={index % 2 === 0 ? 'field' : 'field gray_field'}></span>
            )}

            {user ? (
                <Link className={index % 2 === 0 ? 'field' : 'field gray_field'} to={`/users/${user.id}`}>
                    <span>{user.name} {user.surname} {user.patronymic}</span>
                </Link>
            ) : (
                <span className={index % 2 === 0 ? 'field' : 'field gray_field'}></span> // Обработка отсутствия пользователя
            )}

            <span className={index % 2 === 0 ? 'field' : 'field gray_field'}>{item.comment}</span>
        </>
    );
};

export default Item;

