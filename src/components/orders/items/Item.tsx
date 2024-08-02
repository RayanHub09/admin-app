import React, {FC} from 'react';
import {IItem} from "../../../interfaces";
import './items.sass'

interface IItemProps {
    item: IItem
}
const Item:FC<IItemProps> = ({item}) => {
    return (
       <>
           <span className={'field_order'}></span>
           <span className={'field_order'}>{item.id}</span>
           <span className={'field_order'}>{item.part.priceYen}¥ ({item.part.priceRub}₽)</span>
           <span className={'field_order'}></span>
           <span className={'field_order'}>{item.amount}</span>
           <span className={'field_order'}>{item.comment}</span>
       </>
    );
};

export default Item;