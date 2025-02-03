import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import DetailedDeliveryItem from "../components/deliveries/DetailedDeliveryItem";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {IDelivery} from "../interfaces";
import ChangeDetailedDeliveryItem from "../components/deliveries/ChangeDetailedDeliveryItem";
import CalculateDeliveryCost from "../components/deliveries/CalculateDeliveryCost";
import {
    fetchCancelDelivery, fetchDeleteDelivery,
    resetStatus
} from "../store/slices/deliveries";
import {fetchChangeStatusOrder} from "../store/slices/orders";
import NotFoundPage from "./NotFoundPage";
import CalculateWeight from "../components/deliveries/CalculateWeight";
import ShadowWindow from "../components/ShadowWindow";

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
    const navigation = useNavigate();
    const status = useAppSelector(state => state.deliveries.status);
    const {id} = useParams<{ id: string }>();
    const delivery: IDelivery | undefined = useAppSelector(state =>
        state.deliveries.deliveries.find(delivery => delivery.id === id));
    const orders = useAppSelector(state => {
        const delivery = state.deliveries.deliveries.find((delivery) => delivery.id === id);
        return delivery ? delivery.orders.map(order => order.id) : [];
    });
    const [visibleWindow, setVisibleWindow] = useState(false)
    const [statusDeleteDelivery, setStatusDeleteDelivery] = useState('')

    useEffect(() => {
        window.scrollTo(0, 0)
        setVisible(true)
        setVisibleWindow(false)
    }, []);

    function deleteDeliveryItem() {
        if (id != null) {
            for (const orderId of orders) {
                dispatch(fetchChangeStatusOrder({orderId, newStatus: 'На складе в Японии'}));
            }
            dispatch(fetchCancelDelivery({deliveryId: delivery?.id as string}))
                .then(() => dispatch(resetStatus()));
        }
    }

    function deleteDelivery() {
        setStatusDeleteDelivery('loading')
        dispatch(fetchDeleteDelivery({delivery_id: id as string}))
            .then(() => {
                navigation('/deliveries');
            })
            .then(() => setStatusDeleteDelivery(''))
    }

    if (!delivery) {
        return <NotFoundPage/>
    }

    return (
        <div className={'delivery_page_container'}>
            <div className={'container_menu'}>
                <div className={'buttons_change_container'}>
                    {(manager.role === 'admin' || changeStatusDelivery || changeDeliveryNumber || writeCommentsDelivery) &&
                        <button
                            onClick={() => setChangeMode(!changeMode)}
                            className={'change_button'}>
                            {changeMode ? 'Вернуться к посылке' : 'Изменить'}
                        </button>
                    }
                    {(manager.role === 'admin' || (cancelDelivery && delivery.status.statusName !== 'Отменен')) && visible && !visibleFieldsWeight && !changeMode  &&
                        <button
                            onClick={deleteDeliveryItem}
                            className={'change_button'}>
                            {status === 'loading' ? 'загрузка...' : 'Отменить посылку'}
                        </button>
                    }
                    {(manager.role === 'admin' || (calculateDeliveryCost && !changeMode && !delivery?.deliveryCost)) && !visibleFieldsWeight  &&
                        <button
                            onClick={() => {
                                setVisible(!visible)
                                setVisibleWindow(false)

                            }}
                            className={'change_button'}
                            style={!visible ? {alignSelf: 'flex-end'} : {}}
                        >
                            {!visible ? 'Закрыть' : 'Расчитать стоимость доставки'}
                        </button>
                    }

                    {(manager.role === 'admin' || (manager.changeWeight === true && delivery.deliveryCost === 0 && delivery.deliveryCostYen === 0)) && visible  &&
                        <button
                            onClick={() => {
                                setVisibleFieldsWeight(!visibleFieldsWeight)
                                setVisibleWindow(false)
                            }}
                            className={'change_button'}>{
                            visibleFieldsWeight ? 'Закрыть' : 'Вес и габариты'
                        }</button>}

                </div>
                {manager.role === 'admin' &&
                    <button
                        style={{alignSelf: 'center'}}
                        onClick={() => {
                            setVisibleWindow(!visibleWindow)
                            setVisible(true)
                            setVisibleFieldsWeight(false)
                        }}
                        className={'error_button'}>{
                        'Удалить посылку'
                    }</button>
                }
                {visibleWindow &&
                    <ShadowWindow
                        text={`Вы уверены, что хотите удалить посылку с номером ${delivery.number}?`}
                        onClose={() => setVisibleWindow(false)}
                        deleteFunc={deleteDelivery}
                        status={statusDeleteDelivery}
                    />
                }
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
