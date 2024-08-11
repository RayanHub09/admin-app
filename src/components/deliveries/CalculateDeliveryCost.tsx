import React, {FC, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {fetchCalculateDeliveryCost, resetStatus} from "../../store/slices/deliveries";

interface CalculateDeliveryCostProps {
    visible: boolean
    id: string
}

type Error =  null | 'errorField' | 'errorEnter'

const CalculateDeliveryCost:FC<CalculateDeliveryCostProps> = ({visible, id}) => {

    const dispatch = useAppDispatch()
    const [deliveryCostRu, setDeliveryCostRu] = useState('')
    const [deliveryCostYen, setDeliveryCostYen] = useState('')
    const [errorEnter, setErrorEnter]  = useState(false)
    const [errorField, setErrorField]  = useState(false)
    const [error, setError] = useState<Error>(null)
    const status = useAppSelector(state => state.deliveries.status)
    function calculateDelivery() {
        if (deliveryCostYen.length === 0 || deliveryCostRu.length == 0)
            setError('errorField')
        if (isNaN(+deliveryCostRu) || isNaN(+deliveryCostYen))
            setError('errorEnter')
        else {
            setError(null)
            dispatch(fetchCalculateDeliveryCost({deliveryId:id, deliveryCostRu: +deliveryCostRu, deliveryCostYen: +deliveryCostYen}))
                .then(() => {
                    setDeliveryCostYen('')
                    setDeliveryCostRu('')
                })
                .then(() => dispatch(resetStatus()))
        }
    }
    return (
        <div
            className={'calculate_delivery_container'}
            style={visible ? {display: 'none'} : {display: "flex"}}>
            <div className={'cost_container'}>
                <input
                    value={deliveryCostRu}
                    onChange={event => setDeliveryCostRu(event.target.value)}
                    placeholder={'Стоимость доставки'}/>₽
            </div>
            <div className={'cost_container'}>
                <input
                    value={deliveryCostYen}
                    onChange={event => setDeliveryCostYen(event.target.value)}
                    placeholder={'Стоимость доставки'}/>¥
            </div>

            {(error ||status === 'failed' ) && <div className={'error'}>
                {error === 'errorEnter' && 'Введены некорректные данные!'}
                {error === 'errorField' && 'Заполните все поля!'}
                {status === 'failed' && 'Что-то пошло не так'}
            </div>}
            <button
                onClick={calculateDelivery}
                style={{alignSelf: "center"}}
                disabled={status === 'loading'}
                className={'change_button'}>
                {status === 'loading' ? 'загрузка...' : 'Сохранить'}
            </button>
        </div>
    );
};

export default CalculateDeliveryCost;