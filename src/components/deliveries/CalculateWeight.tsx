import React, {FC, useState} from 'react';
import {IDelivery} from "../../interfaces";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {fetchChangeWeightDelivery, resetStatus} from "../../store/slices/deliveries";

interface IDeliveryProps {
    delivery : IDelivery
}
const CalculateWeight:FC<IDeliveryProps> = ({delivery}) => {
    const [weight, setWeight] = useState(delivery.weight.toString() === '0' ? '' : delivery.weight.toString())
    const [error, setError] = useState('')
    const dispatch = useAppDispatch()
    const status = useAppSelector(state => state.deliveries.status)

    function changeWeightDelivery() {
        if (!isNaN(+weight.replace(',', '.'))) {
            dispatch(fetchChangeWeightDelivery({deliveryId: delivery.id, weight: +weight.replace(',', '.')}))
                .then(() => dispatch(resetStatus()))
        } else {
            setError('Введены некорректные данные!')
            setTimeout(() => {setError('')}, 2000)
        }
    }

    return (
        <div className={'calculate_delivery_container'}>
            <div>
                <input
                    placeholder={'Введите вес'}
                    onChange={event => setWeight(event.target.value)}
                    value={weight}/> <span style={{fontSize: '20px'}}>кг</span>
            </div>
            <button
                style={{alignSelf: "center"}}
                onClick={changeWeightDelivery}
                className={'change_button'}>{
                status === 'loading' ? 'Сохранение...' : 'Сохранить'
            }
            </button>
            {error && <span className={'error'}>{error}</span>}
        </div>
    );
};

export default CalculateWeight;