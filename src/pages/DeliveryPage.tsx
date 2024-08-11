import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import DetailedDeliveryItem from "../components/deliveries/DetailedDeliveryItem";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {IDelivery} from "../interfaces";
import ChangeDetailedDeliveryItem from "../components/deliveries/ChangeDetailedDeliveryItem";
import CalculateDeliveryCost from "../components/deliveries/CalculateDeliveryCost";
import {fetchDeleteDelivery, resetStatus} from "../store/slices/deliveries";


const DeliveryPage = () => {
    const writeCommentsDelivery = useAppSelector(state => state.manager.manager.writeCommentsDelivery)
    const changeStatusDelivery = useAppSelector(state => state.manager.manager.changeStatusDelivery)
    const changeDeliveryNumber = useAppSelector(state => state.manager.manager.changeDeliveryNumber)
    const calculateDeliveryCost = useAppSelector(state => state.manager.manager.calculateDeliveryCost)
    const cancelDelivery = useAppSelector(state => state.manager.manager.cancelDelivery)
    const [changeMode, setChangeMode] = useState(false)
    const [visible, setVisible] = useState(false)
    const dispatch = useAppDispatch()
    const navigation = useNavigate()
    const status = useAppSelector(state => state.orders.status)
    const { id } = useParams<{ id: string }>()
    const delivery:IDelivery|undefined = useAppSelector(state =>
        state.deliveries.deliveries.find(delivery => delivery.id === id))

    useEffect(() => {setVisible(true)}, [])

    function deleteDeliveryItem() {
        if (id != null) {
            dispatch(fetchDeleteDelivery(id))
                .then(() => dispatch(resetStatus()))
                .then(() => navigation('/deliveries'))
        }
    }
    if (!delivery) {
        return <div>Order not found</div>;
    }
    return (
        <div className={'delivery_page_container'}>
            <div className={'buttons_change_container'}>
                {(changeStatusDelivery || changeDeliveryNumber || writeCommentsDelivery )&&
                    <button
                        onClick={() => setChangeMode(!changeMode)}
                        className={'change_button'}>
                        {changeMode ? 'Вернуться к заказу' : 'Изменить'}
                    </button>
                }
                {cancelDelivery && !changeMode &&
                    <button
                        onClick={deleteDeliveryItem}
                        className={'change_button'}>
                        {status === null && 'Удалить'}
                        {status === 'loading' && 'загрузка...'}
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