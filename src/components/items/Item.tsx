import React, {FC} from 'react';
import {IItem, IReItem} from "../../interfaces";
import './items.sass'
import {changeCost} from "../../functions/changeCost";
import {Link} from "react-router-dom";

interface IItemProps {
    item: IReItem & IItem
}
const Item:FC<IItemProps> = ({item}) => {
    return (
       <>
           <span className={'field'}>{item.part.nameRu}</span>
           <span className={'field'}>{item.part.markName}</span>
           <span className={'field'}><h4>{changeCost(item.part.priceYen.toString())}¥</h4>{changeCost(item.part.priceRub.toString())}₽</span>
           <span className={'field'}>{item.part.weight}</span>
           <span className={'field'}>{item.amount}</span>
           {item.idOrder ?
               <Link
                   className={'field'}
                   to={`/orders/${item.idOrder}`}>
                   <span>{item.numberOrder}</span>
               </Link> :
               <span className={'field'}></span>
           }
           {item.idDelivery ?
               <Link
                   className={'field'}
                   to={`/deliveries/${item.idDelivery}`}>
                   <span>{item.numberDelivery}</span>
               </Link> :
               <span className={'field'}></span>
           }
           <span className={'field'}>{item.comment}</span>
       </>
    );
};

export default Item;