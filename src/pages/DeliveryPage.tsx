import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import DetailedDeliveryItem from "../components/deliveries/DetailedDeliveryItem";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {IDelivery} from "../interfaces";
import ChangeDetailedDeliveryItem from "../components/deliveries/ChangeDetailedDeliveryItem";
import CalculateDeliveryCost from "../components/deliveries/CalculateDeliveryCost";
import {
    fetchCancelDelivery,
    fetchDeleteDelivery,
    resetStatus
} from "../store/slices/deliveries";
import {fetchChangeStatusOrder} from "../store/slices/orders";
import NotFoundPage from "./NotFoundPage";
import CalculateWeight from "../components/deliveries/CalculateWeight";

const DeliveryPage = () => {
    const writeCommentsDelivery = useAppSelector(state => state.manager.manager.writeCommentsDelivery);
    const changeStatusDelivery = useAppSelector(state => state.manager.manager.changeStatusDelivery);
    const changeDeliveryNumber = useAppSelector(state => state.manager.manager.changeDeliveryNumber);
    const calculateDeliveryCost = useAppSelector(state => state.manager.manager.calculateDeliveryCost);
    const cancelDelivery = useAppSelector(state => state.manager.manager.cancelDelivery);
    const [changeMode, setChangeMode] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleFieldsWeight, setVisibleFieldsWeight] = useState(false)
    const manager = useAppSelector(state => state.manager.manager);
    const dispatch = useAppDispatch()
    const status = useAppSelector(state => state.deliveries.status);
    const {id} = useParams<{ id: string }>();
    const delivery: IDelivery | undefined = useAppSelector(state =>
        state.deliveries.deliveries.find(delivery => delivery.id === id));
    const orders = useAppSelector(state => {
        const delivery = state.deliveries.deliveries.find((delivery) => delivery.id === id);
        return delivery ? delivery.orders.map(order => order.id) : [];
    });
    const navigation = useNavigate()
    const statusDeleteDelivery = useAppSelector(state => state.deliveries.statusDelete)

    useEffect(() => {
        setVisible(true)
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    function deleteDeliveryItem() {
        if (id != null) {
            for (const orderId of orders) {
                dispatch(fetchChangeStatusOrder({orderId, newStatus: 'На складе в Японии'}));
            }
            dispatch(fetchCancelDelivery({deliveryId: id}))
                .then(() => dispatch(resetStatus()));
        }
    }

    function deleteDelivery() {
        dispatch(fetchDeleteDelivery({delivery_id: id as string})).then(() => {
            navigation('/deliveries')
        })
    }

    if (!delivery) {
        return <NotFoundPage/>
    }

    return (
        <div className={'delivery_page_container'}>
            <div className={'buttons_change_container'}>
                {(manager.role === 'admin' || changeStatusDelivery || changeDeliveryNumber || writeCommentsDelivery) &&
                    <button
                        onClick={() => setChangeMode(!changeMode)}
                        className={'change_button'}>
                        {changeMode ? 'Вернуться к посылке' : 'Изменить'}
                    </button>
                }
                {(manager.role === 'admin' || (cancelDelivery && !changeMode && delivery.status.statusName !== 'Отменен')) &&
                    <button
                        onClick={deleteDeliveryItem}
                        className={'change_button'}>
                        {status === 'loading' ? 'загрузка...' : 'Отменить посылку'}
                    </button>
                }
                {(manager.role === 'admin' || (calculateDeliveryCost && !changeMode && !delivery?.deliveryCost)) && !visibleFieldsWeight &&
                    <button
                        onClick={() => setVisible(!visible)}
                        className={'change_button'}
                        style={!visible ? {alignSelf: 'flex-end'} : {}}
                    >
                        {!visible ? 'Закрыть' : 'Расчитать стоимость доставки'}
                    </button>
                }
                {manager.role === 'admin' &&
                    <button
                        onClick={deleteDelivery}
                        className={'error_button'}>{
                        statusDeleteDelivery === 'loading' ? 'Удаление...' : 'Удалить посылку'
                    }</button>}
                {(manager.role === 'admin' || (manager.changeWeight === true && delivery.deliveryCost === 0 && delivery.deliveryCostYen === 0)) && visible &&
                    <button
                        onClick={() => setVisibleFieldsWeight(!visibleFieldsWeight)}
                        className={'change_button'}>{
                        visibleFieldsWeight ? 'Закрыть' : 'Вес'
                    }</button>}
            </div>
            {manager.role === 'admin' || (!changeMode && !delivery?.deliveryCost) ?
                <CalculateDeliveryCost visible={visible} id={id as string}/>
                : null}
            {visibleFieldsWeight &&
                <CalculateWeight delivery={delivery as IDelivery}/>
            }
            {changeMode ?
                <ChangeDetailedDeliveryItem delivery={delivery as IDelivery}/>
                : <DetailedDeliveryItem delivery={delivery as IDelivery}/>}
        </div>
    );
};

export default DeliveryPage;
