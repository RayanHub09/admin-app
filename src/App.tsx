import React, {useEffect} from 'react';
import './App.sass';
import Router from "./components/router/Router";
import Header from "./components/Header";
import {useAppDispatch, useAppSelector} from "./hooks/redux-hooks";
import {fetchGetAllManagers} from "./store/slices/managers";
import {
    addDeliveryIdNumber,
    changeOrderSnapshot,
    deleteOrderSnapshot,
    fetchGetAllOrders,
    pushNewOrderSnapshot
} from "./store/slices/orders";
import {
    changeDeliverySnapshot,
    deleteDeliverySnapshot,
    fetchGetAllDeliveries,
    pushNewDeliverySnapshot
} from "./store/slices/deliveries";
import {addIdNumberItem, addNewItems, getAllItems, pushNewItems} from "./store/slices/items";
import {IChat, IDelivery, IOrder, IReItem, IReOrder} from "./interfaces";
import {fetchAutoSignIn} from "./store/slices/manager";
import {useNavigate} from "react-router-dom";
import {changeMessage, fetchGetAllChats, pushNewChat, pushNewMessage} from "./store/slices/messages";
import {fetchGetAllUsers} from "./store/slices/users";
import {collection, getFirestore, onSnapshot, serverTimestamp} from "firebase/firestore";


function App() {
    const dispatch = useAppDispatch()
    const manager = useAppSelector(state => state.manager)
    const uid = useAppSelector(state => state.manager?.manager?.id)
    const navigation = useNavigate()

    useEffect(() => {
        const db = getFirestore();
        const chatRoomsRef = collection(db, 'chat_rooms');

        const unsubscribe = onSnapshot(chatRoomsRef, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const chatRoomId = doc.id;
                const messagesRefInChatRoom = collection(db, `chat_rooms/${chatRoomId}/messages`);
                return onSnapshot(messagesRefInChatRoom, (querySnapshot1) => {
                    querySnapshot1.docChanges().forEach((change) => {
                        console.log(change.type)
                        if (change.type === 'added') {
                            console.log(change.doc.data())
                            dispatch(pushNewMessage({
                                messageData: {
                                    ...change.doc.data(),
                                    id: change.doc.id
                                },
                                chat_id: chatRoomId
                            }));
                        } else if (change.type === 'modified') {
                            dispatch(changeMessage({
                                chat_id: chatRoomId,
                                messageData: {
                                    ...change.doc.data(),
                                    id: change.doc.id
                                }
                            }));
                        }
                    });
                });
            });
        });

        return () => unsubscribe(); // Очистка подписки при размонтировании компонента
    }, [dispatch]); // Добавьте dispatch в зависимости


    useEffect(() => {
        const db = getFirestore()
        const ChatsRef = collection(db, 'chat_rooms')
        return onSnapshot(ChatsRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {

                    const chatData = change.doc.data();
                    dispatch(pushNewChat({
                        newChat: {
                            ...chatData,
                            id: change.doc.id
                        }
                    }))

                } else if (change.type === 'removed') {

                }
            })
        })
    }, []);

    useEffect(() => {
        const db = getFirestore();
        const ChatsRef = collection(db, 'orders');

        return onSnapshot(ChatsRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                const order = change.doc.data() as IOrder;
                if (change.type === 'added') {
                    const updatedItems = order.items.map(item => ({
                        ...item,
                        idOrder: order.id,
                        numberOrder: order.number
                    }))
                    const updatedOrder = {
                        ...order,
                        items: updatedItems
                    };

                    dispatch(pushNewOrderSnapshot(updatedOrder));
                    dispatch(addNewItems(updatedItems))
                } else if (change.type === 'removed') {

                } else if (change.type === 'modified') {
                    const updatedItems = order.items.map(item => ({
                        ...item,
                        idOrder: order.id,
                        numberOrder: order.number
                    }))
                    const updatedOrder = {
                        ...order,
                        items: updatedItems
                    };

                    dispatch(pushNewOrderSnapshot(updatedOrder));
                    dispatch(addNewItems(updatedItems))
                }
            });
        });

    }, []);

    useEffect(() => {
        const db = getFirestore();
        const ChatsRef = collection(db, 'deliveries');
        const unsubscribe = onSnapshot(ChatsRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const newDelivery = change.doc.data() as IDelivery;
                    dispatch(pushNewDeliverySnapshot(newDelivery));
                    for (const order of newDelivery.orders) {
                        dispatch(addDeliveryIdNumber([order.id as string, newDelivery.id, newDelivery.number]))
                        for (const item of order.items) {
                            dispatch(addIdNumberItem([item.id, newDelivery.id, newDelivery.number, order.id, order.number]))
                        }
                    }
                } else if (change.type === 'removed') {
                    dispatch(deleteDeliverySnapshot(change.doc.data().id));
                }
            });
        });

        // Функция очистки для отписки от изменений
        return () => unsubscribe();
    }, [dispatch]);

    useEffect(() => {
        if (manager.isAuth) {
            dispatch(fetchGetAllManagers());
            dispatch(fetchGetAllChats());
            dispatch(fetchGetAllUsers());
            dispatch(fetchGetAllDeliveries())
                .then((data) => {
                    const deliveries = data.payload as IDelivery[];
                    console.log(deliveries)
                    if (Array.isArray(deliveries) && deliveries.length > 0) {
                        return deliveries.reduce((acc, delivery) => {
                            return [
                                ...acc,
                                ...(delivery.orders ? delivery.orders.map((order) => ({
                                    ...order,
                                    status : {
                                        ...order.status,
                                        statusName : 'yt'
                                    },
                                    numberDelivery: delivery.number,
                                    idDelivery: delivery.id
                                } as IReOrder)) : [])
                            ];
                        }, [] as IReOrder[]);
                    }
                    return [];

                })
                .then((ordersWithDeliveryInfo) => {
                    console.log(ordersWithDeliveryInfo)
                    return dispatch(fetchGetAllOrders()).then((data) => {
                        return { orders: data.payload as IOrder[], ordersWithDeliveryInfo };
                    });
                })
                .then(({ orders, ordersWithDeliveryInfo }) => {
                    const combinedOrders = [...orders, ...ordersWithDeliveryInfo];

                    const uniqueOrders = combinedOrders.filter((order, index, self) =>
                        index === self.findIndex((o) => o.id === order.id)
                    )

                    const items = uniqueOrders.reduce((acc, order) => {
                        const deliveryInfo = ordersWithDeliveryInfo.find(o => o.id === order.id)
                        const numberDelivery = deliveryInfo ? deliveryInfo.numberDelivery : ''
                        const idDelivery = deliveryInfo ? deliveryInfo.idDelivery : ''

                        return [
                            ...acc,
                            ...(order.items ? order.items.map((item) => ({
                                ...item,
                                dateOrder: order.date,
                                numberOrder: order.number,
                                idOrder: order.id,
                                numberDelivery: numberDelivery,
                                idDelivery: idDelivery,
                                statusOrder: order.status.statusName,
                                uid: order.uid
                            } as IReItem)) : [])
                        ];
                    }, [] as IReItem[]);

                    dispatch(getAllItems(items));
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
