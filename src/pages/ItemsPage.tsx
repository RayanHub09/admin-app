import React from 'react';
import ItemsListAll from "../components/items/ItemsListAll";
import SearchItem from "../components/items/SearchItem";

const ItemsPage = () => {
    return (
        <div className={'items_page_container'}>
            <SearchItem />
            <ItemsListAll />
        </div>
    );
};

export default ItemsPage;