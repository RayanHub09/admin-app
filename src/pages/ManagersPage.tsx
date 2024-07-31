import React from 'react';
import CreateManagers from "../components/managers/CreateManagers";

const ManagersPage = () => {
    return (
        <div className={'container'}>
            <h1>Менеджеры</h1>
            <CreateManagers />
        </div>
    )
};

export default ManagersPage;