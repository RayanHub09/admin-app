import React, {useEffect} from 'react';
import CreateManagers from "../components/managers/CreateManagers";
import ManagersList from "../components/managers/ManagersList";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {fetchGetAllOrders} from "../store/slices/orders";
import {fetchGetAllManagers} from "../store/slices/managers";
import Loading from "../components/Loading";

const ManagersPage = () => {

    return (
        <div className={'managers_page_container'}>
            <CreateManagers />
            <ManagersList />
        </div>
    )

};

export default ManagersPage;