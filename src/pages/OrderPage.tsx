import React, {useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import { IOrder } from "../interfaces";
import DetailedOrderItem from "../components/orders/DetailedOrderItem";
import ChangeDetailedOrderItem from "../components/orders/ChangeDetailedOrderItem";
import {fetchDeleteOrder, resetStatus} from "../store/slices/orders";

const OrderPage: React.FC = () => {
    const writeCommentsOrder = useAppSelector(state => state.manager.manager.writeCommentsOrder)
    const changeStatusOrder = useAppSelector(state => state.manager.manager.changeStatusOrder)
    const changeOrderNumber = useAppSelector(state => state.manager.manager.changeOrderNumber)
    const cancelOrder = useAppSelector(state => state.manager.manager.cancelOrder)
    const [changeMode, setChangeMode] = useState(false)
    const dispatch = useAppDispatch()
    const navigation = useNavigate()
    const status = useAppSelector(state => state.orders.status)
    const { id } = useParams<{ id: string }>()
    const order: IOrder | undefined = useAppSelector(state =>
        state.orders.orders.find(order => order.id === id)
    )

    function deleteOrderItem() {
        if (id != null) {
            dispatch(fetchDeleteOrder(id))
                .then(() => dispatch(resetStatus()))
                .then(() => navigation('/orders'))
        }


    }

    if (!order) {
        return <div>Order not found</div>;
    }
    return (
        <div className={'order_page_container'}>
            <div className={'buttons_change_container'}>
                {(changeStatusOrder || changeOrderNumber || writeCommentsOrder )&&
                    <button
                        onClick={() => setChangeMode(!changeMode)}
                        className={'change_button'}>
                        {changeMode ? 'Вернуться к заказу' : 'Изменить'}
                    </button>
                }
                {cancelOrder &&
                    <button
                        onClick={deleteOrderItem}
                        className={'change_button'}>
                        {status === null && 'Удалить'}
                        {status === 'loading' && 'загрузка...'}
                    </button>
                }
            </div>
            {changeMode ? <ChangeDetailedOrderItem order={order} /> : <DetailedOrderItem order={order} />}
        </div>
    );
};

export default OrderPage;
