import React, {FC} from 'react';
import {IItem} from "../../interfaces";
import './items.sass'

interface IItemProps {
    item: IItem
}
const Item:FC<IItemProps> = ({item}) => {
    return (
       <>
           <span className={'field'}></span>
           <span className={'field'}>{item.id}</span>
           <span className={'field'}>{item.part.priceYen}¥ ({item.part.priceRub}₽)</span>
           <span className={'field'}></span>
           <span className={'field'}>{item.amount}</span>
           <span className={'field'}>{item.comment}</span>
       </>
    );
};

export default Item;