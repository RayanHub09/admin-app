import React, {FC} from 'react';
import {IItem} from "../interfaces";
import Item from "./Item";
import './items.sass'

interface ItemsListProps {
    itemsList: IItem[]
}
const ItemsList:FC<ItemsListProps> = ({itemsList}) => {
    return (
        <div className={'items_list_container'}>
            <h3>Список товаров</h3>
            <div className={'items_list'}>
                <h4 className={'label_order'}>Статус</h4>
                <h4 className={'label_order'}>Наменование</h4>
                <h4 className={'label_order'}>Цена(1шт.)</h4>
                <h4 className={'label_order'}>Вес(1шт.)</h4>
                <h4 className={'label_order'}>Кол-во</h4>
                <h4 className={'label_order'}>Комментарий</h4>
                {itemsList.map(item => (
                    <Item item={item} />
                ))}
            </div>
        </div>
    );
};

export default ItemsList;