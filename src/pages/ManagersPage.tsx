import React, {useEffect} from 'react';
import CreateManagers from "../components/managers/CreateManagers";
import ManagersList from "../components/managers/ManagersList";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {fetchGetAllOrders} from "../store/slices/orders";
import {fetchGetAllManagers} from "../store/slices/managers";
import Loading from "../components/Loading";

const ManagersPage = () => {
    // const dispatch = useAppDispatch()
    // const isAuth = useAppSelector(state => state.manager.isAuth)
    // const statusManager = useAppSelector(state => state.managers.status)
    //
    // useEffect(() => {
    //     if (isAuth) {
    //         dispatch(fetchGetAllManagers())
    //     }
    // }, [statusManager, isAuth])

    return (
        <div className={'managers_page_container'}>
            <CreateManagers />
            <ManagersList />
        </div>
    )

};

export default ManagersPage;