import React, {useState} from 'react';
import {useAppDispatch} from "../hooks/redux-hooks";
import {searchOrder} from "../store/slices/orders";

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useAppDispatch()
    function search(event: string) {
        setSearchTerm(event)
        console.log(event)
        dispatch(searchOrder(event))
    }

    return (
        <div className={'search_container'}>
            <input
                value={searchTerm}
                onChange={event => search(event.target.value)}
                placeholder={'Введите номер заказа'}/>
        </div>
    );
};

export default Search;