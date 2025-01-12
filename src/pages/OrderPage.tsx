import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {IOrder, IReOrder} from "../interfaces";
import DetailedOrderItem from "../components/orders/DetailedOrderItem";
import ChangeDetailedOrderItem from "../components/orders/ChangeDetailedOrderItem";
import {fetchCancelOrder, resetStatus} from "../store/slices/orders";
import NotFoundPage from "./NotFoundPage";

const OrderPage: React.FC = () => {
    const writeCommentsOrder = useAppSelector(state => state.manager.manager.writeCommentsOrder)
    const changeStatusOrder = useAppSelector(state => state.manager.manager.changeStatusOrder)
    const changeOrderNumber = useAppSelector(state => state.manager.manager.changeOrderNumber)
    const cancelOrder = useAppSelector(state => state.manager.manager.cancelOrder)
    const [changeMode, setChangeMode] = useState(false)
    const dispatch = useAppDispatch()
    const navigation = useNavigate()
    const status = useAppSelector(state => state.orders.status)
    const {id} = useParams<{ id: string }>()
    const order: IOrder | undefined = useAppSelector(state =>
        state.orders.orders.find(order => order.id === id)
    )

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!order) {
        return <NotFoundPage/>
    }
    return (
        <div className={'order_page_container'}>
            <div className={'buttons_change_container'}>
                {(changeStatusOrder || changeOrderNumber || writeCommentsOrder) &&
                    <button
                        onClick={() => setChangeMode(!changeMode)}
                        className={'change_button'}>
                        {changeMode ? 'Вернуться к заказу' : 'Изменить'}
                    </button>
                }
            </div>
            {changeMode ? <ChangeDetailedOrderItem order={order as IReOrder}/> : <DetailedOrderItem order={order}/>}
        </div>
    );
};

export default OrderPage;
