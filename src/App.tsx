import React, {useEffect} from 'react';
import './App.sass';
import Router from "./components/router/Router";
import Header from "./components/Header";
import {useAppDispatch, useAppSelector} from "./hooks/redux-hooks";
import {fetchGetAllManagers} from "./store/slices/managers";
import {changeOrderSnapshot, deleteOrderSnapshot, fetchGetAllOrders, pushNewOrderSnapshot} from "./store/slices/orders";
import {
    changeDeliverySnapshot,
    deleteDeliverySnapshot,
    fetchGetAllDeliveries,
    pushNewDeliverySnapshot
} from "./store/slices/deliveries";
import {getAllItems} from "./store/slices/items";
import {IDelivery, IItem, IOrder, IReItem, IReOrder} from "./interfaces";
import {fetchAutoSignIn} from "./store/slices/manager";
import {useNavigate} from "react-router-dom";
import {fetchGetAllChats, pushNewMessage} from "./store/slices/messages";
import {fetchGetAllUsers} from "./store/slices/users";
import {collection, getFirestore, onSnapshot} from "firebase/firestore";


function App() {
    const dispatch = useAppDispatch()
    const manager = useAppSelector(state => state.manager)
    const uid = useAppSelector(state => state.manager?.manager?.id)
    const navigation = useNavigate()
    useEffect(() => {
        const db = getFirestore();
        const ordersRef = collection(db, 'orders');
        const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'modified') {
                    dispatch(changeOrderSnapshot(change.doc.data() as IOrder))
                } else if (change.type === 'added') {
                    dispatch(pushNewOrderSnapshot(change.doc.data() as IOrder))
                } else if (change.type === 'removed') {
                    dispatch(deleteOrderSnapshot(change.doc.id)) // Используйте change.doc.id вместо change.doc.data().id
                }
            });
        });
        return () => unsubscribe(); // Очистка обработчика
    }, []);

    useEffect(() => {
        const db = getFirestore();
        const chatRoomsRef = collection(db, 'chat_rooms')

        return onSnapshot(chatRoomsRef, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const chatRoomId = doc.id
                const messagesRefInChatRoom = collection(db, `chat_rooms/${chatRoomId}/messages`);

                return onSnapshot(messagesRefInChatRoom, (querySnapshot1) => {
                    querySnapshot1.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            dispatch(pushNewMessage({
                                messageData: change.doc.data(),
                                chat_id: change.doc.ref.path.split('/')[1]
                            }))
                        }
                    })
                })
            })
        })
    }, [])


    useEffect(() => {
        const db = getFirestore()
        const DeliveriesRef = collection(db, 'deliveries')
        return onSnapshot(DeliveriesRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'modified') {
                    dispatch(changeDeliverySnapshot(change.doc.data() as IDelivery))
                } else if (change.type === 'added') {
                    dispatch(pushNewDeliverySnapshot(change.doc.data() as IDelivery))
                } else if (change.type === 'removed') {
                    dispatch(deleteDeliverySnapshot(change.doc.data().id))
                }
            })
        })
    }, []);

    useEffect(() => {
        if (manager.isAuth) {
            dispatch(fetchGetAllManagers())
            dispatch(fetchGetAllChats())
            dispatch(fetchGetAllUsers())
            dispatch(fetchGetAllOrders())
            dispatch(fetchGetAllDeliveries())
                .then((data) => {
                    const deliveries = data.payload as IDelivery[]
                    console.log(deliveries)
                    return deliveries
                })
                .then((deliveries) => {
                    if (Array.isArray(deliveries) && deliveries.length > 0) {
                        const orders = deliveries.reduce((acc, delivery) => {
                            return [...acc, ...(delivery.orders ? delivery.orders.map((order) => ({
                                ...order,
                                numberDelivery: delivery.number
                            } as IReOrder)) : [])];
                        }, [] as IReOrder[]);

                        const items = orders.reduce((acc, order) => {
                            return [...acc, ...(order.items ? order.items.map((item) => ({
                                ...item,
                                dateOrder: order.date,
                                numberOrder: order.number,
                                numberDelivery: order.numberDelivery,
                                statusOrder: order.status.statusName
                            } as IReItem)) : [])];
                        }, [] as IReItem[]);


                        dispatch(getAllItems(items));
                    }
                });
        }
    }, [manager.isAuth]);
    useEffect(() => {
        if (manager.token) {
            navigation('/orders')
            dispatch(fetchAutoSignIn())
        }
    }, [])


    return (
        <div className={'App'}>
            <Header/>
            <Router/>
        </div>
    )
}

export default App;
