import React, {FC, useState} from 'react';
import {IDelivery} from "../../interfaces";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {fetchChangeWeightDelivery, resetStatus} from "../../store/slices/deliveries";

interface IDeliveryProps {
    delivery: IDelivery
}

const CalculateWeight: FC<IDeliveryProps> = ({delivery}) => {
    const [weight, setWeight] = useState(delivery.weight.toString() === '0' ? '' : delivery.weight.toString())
    const [size, setSize] = useState('')
    const [error, setError] = useState('')
    const dispatch = useAppDispatch()
    const status = useAppSelector(state => state.deliveries.status)

    function changeWeightDelivery() {
        const parsedWeight = +weight.replace(',', '.');
        const parsedSize = size.replace(' ', '').split(',').map(Number);

        // Проверка корректности введенных данных
        const isWeightValid = !isNaN(parsedWeight);
        const isSizeValid = parsedSize.length === 3 && parsedSize.every(dim => !isNaN(dim));

        if (isWeightValid && isSizeValid) {
            dispatch(fetchChangeWeightDelivery({
                deliveryId: delivery.id,
                weight: parsedWeight,
                width: parsedSize[0].toString(),
                height: parsedSize[1].toString(),
                length: parsedSize[2].toString(),
            }))
                .then(() => dispatch(resetStatus()))
                .catch(err => {
                    console.error('Error updating delivery weight:', err);
                    setError('Ошибка при обновлении данных!');
                    setTimeout(() => setError(''), 2000);
                });
        } else {
            setError('Введены некорректные данные!');
            setTimeout(() => setError(''), 2000);
        }
    }


    return (
        <div className={'calculate_delivery_container'}>
            <div className={'calculate_delivery_container_input'}>
                <input
                    placeholder={'Введите вес'}
                    onChange={event => setWeight(event.target.value)}
                    value={weight}/>
                <span style={{fontSize: '20px'}}>кг</span>
            </div>
            <div className={'calculate_delivery_container_input'}>
                <input
                    value={size}
                    onChange={event => setSize(event.target.value)}
                    placeholder={'Ширина, высота, длина'}/>
                <span style={{fontSize: '20px'}}>см</span>
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