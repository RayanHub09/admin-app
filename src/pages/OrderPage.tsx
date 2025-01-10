import React, {useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {IOrder, IReOrder} from "../interfaces";
import DetailedOrderItem from "../components/orders/DetailedOrderItem";
import ChangeDetailedOrderItem from "../components/orders/ChangeDetailedOrderItem";
import {fetchCancelOrder, resetStatus} from "../store/slices/orders";

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
            dispatch(fetchCancelOrder(id))
                .then(() => dispatch(resetStatus()))
                // .then(() => navigation('/orders'))

        }


    }

    if (!order) {
        return <div className={'no_chats_message'}>Такого заказа не существует.</div>;
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
                {/*{cancelOrder && order.status.statusName !== 'Отменен' && !changeMode &&*/}
                {/*    <button*/}
                {/*        onClick={deleteOrderItem}*/}
                {/*        className={'change_button'}>*/}
                {/*        {status === 'loading' ? 'загрузка...' : 'Отменить'}*/}
                {/*    </button>*/}
                {/*}*/}
            </div>
            {changeMode ? <ChangeDetailedOrderItem order={order as IReOrder} /> : <DetailedOrderItem order={order} />}
        </div>
    );
};

export default OrderPage;
