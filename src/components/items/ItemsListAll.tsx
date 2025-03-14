import React, {useEffect} from 'react';
import Item from "./Item";
import { useAppSelector } from "../../hooks/redux-hooks";
import NotFoundText from "../NotFoundText";

const ItemsListAll = () => {
    const items = useAppSelector(state => state.items.items);
    const sortedItems = useAppSelector(state => state.items.sortedItems);
    const filteredItems = useAppSelector(state => state.items.filteredItems);
    const filteredSortedItems = useAppSelector(state => state.items.filteredSortedItems);
    const isSearching = useAppSelector(state => state.items.isSearching);
    const isSorting = useAppSelector(state => state.items.isSorting);

    if (items.length === 0) {
        return <div className={'container'} style={{fontSize: '30px'}}>Пока нет товаров</div>
    }

    // useEffect
    return (
        <div className={'items_list_all_container'}>
            {(isSearching && filteredItems.length === 0) ? (
                <NotFoundText />
            ) : (
                <div className={'items_list'}>
                    <h4 className={'label_order'}>Наименование</h4>
                    <h4 className={'label_order'}>Производитель</h4>
                    <h4 className={'label_order'}>Цена(1шт.)</h4>
                    <h4 className={'label_order'}>Вес(1шт.)</h4>
                    <h4 className={'label_order'}>Кол-во</h4>
                    <h4 className={'label_order'}>Номер заказа</h4>
                    <h4 className={'label_order'}>Номер посылки</h4>
                    <h4 className={'label_order'}>Покупатель</h4>
                    <h4 className={'label_order'}>Комментарий</h4>
                    {isSearching
                        ? (isSorting ? filteredSortedItems.map((item, index) => (
                            <Item item={item} key={index} />
                        )) : filteredItems.map((item, index) => (
                            <Item item={item} key={index} />
                        )))
                        : (isSorting ? sortedItems.map((item, index) => (
                            <Item item={item} key={index} />
                        )) : items.map((item, index) => (
                            <Item item={item} key={index} />
                        )))
                    }

                </div>
            )}
        </div>
    );
};

export default ItemsListAll;
