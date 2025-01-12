import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import DetailedDeliveryItem from "../components/deliveries/DetailedDeliveryItem";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {IDelivery} from "../interfaces";
import ChangeDetailedDeliveryItem from "../components/deliveries/ChangeDetailedDeliveryItem";
import CalculateDeliveryCost from "../components/deliveries/CalculateDeliveryCost";
import {fetchCancelDelivery, fetchChangeStatusOrderDelivery, resetStatus} from "../store/slices/deliveries";
import {fetchChangeStatusOrder} from "../store/slices/orders";
import NotFoundPage from "./NotFoundPage";


const DeliveryPage = () => {
    const writeCommentsDelivery = useAppSelector(state => state.manager.manager.writeCommentsDelivery)
    const changeStatusDelivery = useAppSelector(state => state.manager.manager.changeStatusDelivery)
    const changeDeliveryNumber = useAppSelector(state => state.manager.manager.changeDeliveryNumber)
    const calculateDeliveryCost = useAppSelector(state => state.manager.manager.calculateDeliveryCost)
    const cancelDelivery = useAppSelector(state => state.manager.manager.cancelDelivery)
    const [changeMode, setChangeMode] = useState(false)
    const [visible, setVisible] = useState(false)
    const dispatch = useAppDispatch()
    const status = useAppSelector(state => state.deliveries.status)
    const { id } = useParams<{ id: string }>()
    const delivery:IDelivery|undefined = useAppSelector(state =>
        state.deliveries.deliveries.find(delivery => delivery.id === id))
    const orders = useAppSelector(state => {
        const delivery = state.deliveries.deliveries.find((delivery) => delivery.id === id);
        return delivery ? delivery.orders.map(order => order.id) : [];
    })
    useEffect(() => {setVisible(true)}, [])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    function deleteDeliveryItem() {
        if (id != null) {
            for (const orderId of orders) {
                dispatch(fetchChangeStatusOrder({orderId, newStatus: 'На складе в Японии'}))
            }
            dispatch(fetchCancelDelivery({deliveryId: id}))
                .then(() => dispatch(resetStatus()))
        }
    }
    if (!delivery) {
        return <NotFoundPage />
    }
    return (
        <div className={'delivery_page_container'}>
            <div className={'buttons_change_container'}>
                {(changeStatusDelivery || changeDeliveryNumber || writeCommentsDelivery )&&
                    <button
                        onClick={() => setChangeMode(!changeMode)}
                        className={'change_button'}>
                        {changeMode ? 'Вернуться к посылке' : 'Изменить'}
                    </button>
                }
                {cancelDelivery && !changeMode && delivery.status.statusName !== 'Отменен'  &&
                    <button
                        onClick={deleteDeliveryItem}
                        className={'change_button'}>
                        {status === 'loading' ? 'загрузка...' : 'Отменить посылку'}
                    </button>
                }
                {calculateDeliveryCost && !changeMode && !delivery?.deliveryCost &&
                    <button
                        onClick={() => setVisible(!visible)}
                        className={'change_button'}
                        style={!visible ? {alignSelf: 'flex-end'} : {}}
                    >
                        {!visible ? 'Закрыть' : 'Расчитать стоимость доставки'}
                    </button>
                }
            </div>
            {!changeMode && !delivery?.deliveryCost && <CalculateDeliveryCost visible={visible} id={id as string}/>}
            {changeMode ? <ChangeDetailedDeliveryItem delivery={delivery as IDelivery}/> : <DetailedDeliveryItem delivery={delivery as IDelivery}/>}
        </div>
    );
};

export default DeliveryPage;