import React, {FC, useState} from 'react';
import {useAppDispatch} from "../hooks/redux-hooks";
import {searchOrder} from "../store/slices/orders";

interface ISearchProps {
    funcSearch: (searchTerm:string) => void
}


const Search:FC<ISearchProps> = ({funcSearch}) => {
    const [searchTerm, setSearchTerm] = useState('')

    function search(event: string) {
        setSearchTerm(event)
        funcSearch(event)
    }

    return (
        <div className={'search_container'}>
            <input
                value={searchTerm}
                onChange={event => search(event.target.value)}
                placeholder={'Введите номер'}/>
        </div>
    );
};

export default Search;