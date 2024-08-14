import React from 'react';
import SearchItem from "./SearchItem";
import Item from "./Item";
import {useAppSelector} from "../../hooks/redux-hooks";

const ItemsListAll = () => {
    const items = useAppSelector(state => state.items.items)
    return (
        <div>
            <SearchItem />
            {items.map(item => (
                <Item item={item} key={item.id}/>
            ))}
        </div>
    );
};

export default ItemsListAll;