import React from 'react';
import CreateManagers from "../components/managers/CreateManagers";
import ManagersList from "../components/managers/ManagersList";

const ManagersPage = () => {

    return (
        <div className={'managers_page_container'}>
            <CreateManagers />
            <ManagersList />
        </div>
    )
};

export default ManagersPage;