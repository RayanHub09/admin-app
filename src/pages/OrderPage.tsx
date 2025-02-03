import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { IOrder, IReOrder } from "../interfaces";
import DetailedOrderItem from "../components/orders/DetailedOrderItem";
import ChangeDetailedOrderItem from "../components/orders/ChangeDetailedOrderItem";
import { fetchDeleteOrder } from "../store/slices/orders";
import NotFoundPage from "./NotFoundPage";
import { deleteItems } from "../store/slices/items";
import ShadowWindow from "../components/ShadowWindow";

const OrderPage: React.FC = () => {
    const writeCommentsOrder = useAppSelector(state => state.manager.manager.writeCommentsOrder);
    const changeStatusOrder = useAppSelector(state => state.manager.manager.changeStatusOrder);
    const changeOrderNumber = useAppSelector(state => state.manager.manager.changeOrderNumber);
    const [changeMode, setChangeMode] = useState(false);
    const dispatch = useAppDispatch();
    const [visibleWindow, setVisibleWindow] = useState(false);
    const [statusDeleteOrder, setStatusDeleteOrder] = useState('');
    const status = useAppSelector(state => state.orders.statusDelete)
    const { id } = useParams<{ id: string }>();
    const order: IOrder | undefined = useAppSelector(state =>
        state.orders.orders.find(order => order.id === id)
    );
    const manager = useAppSelector(state => state.manager.manager);
    const navigation = useNavigate();

    function deleteOrder() {
        console.log(status)
        setStatusDeleteOrder('loading');
        dispatch(fetchDeleteOrder({ order_id: order?.id as string }))
            .then(() => {
                if (order?.items) {
                    dispatch(deleteItems(order.items.map(item => item.id)));
                }
            })
            .then(() => {
                setStatusDeleteOrder('');
                navigation('/orders');
            });
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!order) {
        return <NotFoundPage />;
    }

    return (
        <div className={'order_page_container'}>
            <div className={'buttons_change_container_order'}>
                {(changeStatusOrder || changeOrderNumber || writeCommentsOrder || manager.role === 'admin') &&
                    <button
                        onClick={() => setChangeMode(!changeMode)}
                        className={'change_button'}>
                        {changeMode ? 'Вернуться к заказу' : 'Изменить'}
                    </button>
                }
                {manager.role === 'admin' &&
                    <button
                        onClick={() => setVisibleWindow(true)}
                        className={'error_button'}>
                        Удалить заказ
                    </button>}
                {visibleWindow &&
                    <ShadowWindow
                        text={`Вы уверены, что хотите удалить заказ под номером ${order.number}?`}
                        onClose={() => setVisibleWindow(false)}
                        deleteFunc={deleteOrder}
                        status={status}
                    />
                }
            </div>
            <div>
                {changeMode ? <ChangeDetailedOrderItem order={order as IReOrder} /> : <DetailedOrderItem key={order.id} order={order as IReOrder} />}
            </div>
        </div>
    );
};

export default OrderPage;
