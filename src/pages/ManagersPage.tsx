import React from 'react';
import CreateManagers from "../components/managers/CreateManagers";

const ManagersPage = () => {
    return (
        <div className={'managers_container'}>
            <CreateManagers />
            <h1>Менеджеры</h1>
        </div>
    )
};

export default ManagersPage;