import React from 'react';
import CreateOrder from "../components/orders/CreateOrder";

const CreateOrderPage = () => {
    return (
        <div className={'create_order_page'}>
            <h2>Создание заказа</h2>
            <CreateOrder />
        </div>
    );
};

export default CreateOrderPage;