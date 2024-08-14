import React from 'react';
import {useAppSelector} from "../hooks/redux-hooks";
import Item from "../components/items/Item";
import SearchItem from "../components/items/SearchItem";
import ItemsListAll from "../components/items/ItemsListAll";

const ItemsPage = () => {
    return (
        <div className={'items_page_container'}>
            <ItemsListAll />
        </div>
    );
};

export default ItemsPage;