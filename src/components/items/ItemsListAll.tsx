import React from 'react';
import SearchItem from "./SearchItem";
import Item from "./Item";
import {useAppSelector} from "../../hooks/redux-hooks";

const ItemsListAll = () => {
    const items = useAppSelector(state => state.items.items)
    const filteredItems = useAppSelector(state => state.items.filteredItems)
    const isSearching = useAppSelector(state => state.items.isSearching)
    return (
        <div className={'items_list_all_container'}>
            <SearchItem />
            {(filteredItems.length == 0 && isSearching) ? (<h2 className={'nothing_found'}>Ничего не найдено.<br/><br/>Проверьте данные<br/> и попробуйте еще раз.</h2>) :
                <div className={'items_list'}>
                    <h4 className={'label_order'}>Наменование</h4>
                    <h4 className={'label_order'}>Производитель</h4>
                    <h4 className={'label_order'}>Цена(1шт.)</h4>
                    <h4 className={'label_order'}>Вес(1шт.)</h4>
                    <h4 className={'label_order'}>Кол-во</h4>
                    <h4 className={'label_order'}>Номер заказа</h4>
                    <h4 className={'label_order'}>Номер посылки</h4>
                    <h4 className={'label_order'}>Комментарий</h4>
                    {isSearching
                        ?
                        filteredItems.map((item, index) => (
                                <Item item={item} key={index}/>
                            ))
                        :
                        items.map((item, index) => (
                                <Item item={item} key={index}/>
                            ))
                    }
                </div>
            }
        </div>
    );
};

export default ItemsListAll;