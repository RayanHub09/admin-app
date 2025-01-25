import {IDelivery, IOrder} from "../../interfaces"
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {collection, db, deleteDoc, doc, getDoc, getDocs, query, updateDoc} from "../../firebase";
import serializeData from "../../Serializer";
import {convertStringToDate, getDate} from "../../functions/changeDate";
import {RootState} from "../index";
import {arrayUnion, serverTimestamp, Timestamp} from "firebase/firestore";
import {deleteChat} from "./messages";
import {useAppSelector} from "../../hooks/redux-hooks";


interface IState {
    deliveries: IDelivery[]
    sortedDeliveries: IDelivery[]
    filteredSortedDeliveries: IDelivery[]
    error: string | null
    paramSort: boolean | null
    isSearching: boolean
    isSorting: boolean
    filteredDeliveries: IDelivery[]
    status: 'loading' | 'succeeded' | 'failed' | null
    statusGet: 'loading' | 'succeeded' | 'failed' | null
    statusDelete: 'loading' | 'succeeded' | 'failed' | null
}

const initialState: IState = {
    deliveries: [],
    sortedDeliveries: [],
    filteredSortedDeliveries: [],
    error: null,
    isSearching: false,
    isSorting: false,
    paramSort: null,
    filteredDeliveries: [],
    status: null,
    statusGet: null,
    statusDelete: null
}

export const fetchGetAllDeliveries = createAsyncThunk(
    'deliveries/fetchGetAllDeliveries',
    async (arg, thunkAPI) => {
        try {
            const q = query(collection(db, "deliveries"));
            const querySnapshot = await getDocs(q);
            const deliveries: IDelivery[] = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const serializedOrders: IOrder[] = data.orders.map((order: any) => ({
                    id: order.id,
                    comment: order.comment,
                    date: order.date.seconds,
                    items: order.items,
                    itemsCnt: order.itemsCnt,
                    number: order.number,
                    priceRu: order.priceRu,
                    priceYen: order.priceYen,
                    status: {
                        archived: data.status.archived || false,
                        date: data.status.date.seconds,
                        readyToPackage: data.status.readyToPackage,
                        statusName: data.status.statusName
                    },
                    uid: order.uid
                }));

                const serializedData: IDelivery = {
                    id: doc.id,
                    comment: data.comment,
                    country: data.country,
                    creationDate: data.creationDate.seconds,
                    customer: data.customer,
                    deliveryCost: data.deliveryCost,
                    deliveryCostYen: data.deliveryCostYen,
                    deliveryMethod: data.deliveryMethod,
                    number: data.number,
                    orders: serializedOrders,
                    partsCostRu: data.partsCostRu,
                    partsCostYen: data.partsCostYen,
                    ruDelivery: data.ruDelivery,
                    status: {
                        date: data.status.date.seconds,
                        readyToBuy: data.status.readyToBuy,
                        statusName: data.status.statusName
                    },
                    uid: data.uid,
                    weight: data.weight,
                    sizeSm: data.sizeSm
                };
                return serializedData;
            });
            thunkAPI.dispatch(getAllDeliveries(deliveries));
            return deliveries;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const fetchChangeDelivery = createAsyncThunk(
    'deliveries/fetchChangeDelivery',
    async ({
               deliveryId,
               newStatus,
               newComment,
               newNumber
           }: { deliveryId: string, newStatus: string, newComment: string, newNumber: string }, thunkAPI) => {
        const deliveryDocRef = doc(db, 'deliveries', deliveryId)
        try {
            const updateData: { [key: string]: string | any } = {};
            if (newStatus !== undefined) {
                updateData['status.statusName'] = newStatus
                updateData['status.date'] = serverTimestamp()
            }
            ;
            if (newComment !== undefined) updateData['comment'] = newComment;
            if (newNumber !== undefined) updateData['number'] = newNumber;
            await updateDoc(deliveryDocRef, updateData)
            const updatedDelivery = {deliveryId, newStatus, newComment, newNumber}
            thunkAPI.dispatch(changeDelivery(updatedDelivery))
        } catch (e: any) {
            thunkAPI.rejectWithValue(e.message)
        }
    }
)
export const fetchCalculateDeliveryCost = createAsyncThunk(
    'deliveries/fetchCalculateDeliveryCost',
    async ({
               deliveryId,
               deliveryCostRu,
               deliveryCostYen
           }: { deliveryId: string, deliveryCostRu: number, deliveryCostYen: number }, thunkAPI) => {
        try {
            const deliveryDocRef = doc(db, 'deliveries', deliveryId)
            const newData = {
                deliveryCost: deliveryCostRu,
                deliveryCostYen: deliveryCostYen
            }
            await updateDoc(deliveryDocRef, newData)
            const updateDelivery = {deliveryId, deliveryCostRu, deliveryCostYen}
            thunkAPI.dispatch(calculateDeliveryCost(updateDelivery))
        } catch (e: any) {
            thunkAPI.rejectWithValue(e.message)
        }
    }
)

export const fetchCancelDelivery = createAsyncThunk(
    'deliveries/fetchDeleteDelivery',
    async ({deliveryId}: { deliveryId: string }, thunkAPI) => {
        try {
            const deliveryDocRef = doc(db, 'deliveries', deliveryId)
            const deliveryDoc = await getDoc(deliveryDocRef)
            const deliveryData = deliveryDoc.data()
            const updatedOrders = deliveryData?.orders.map((order: IOrder) => ({
                ...order,
                ['status.statusName']: 'На складе в Японии',
                ['status.date']: serverTimestamp()
            }))
            await updateDoc(deliveryDocRef, {
                ['status.statusName']: 'Отменен',
                orders: updatedOrders
            })
            thunkAPI.dispatch(cancelDelivery({deliveryId}));

        } catch (e: any) {
            thunkAPI.rejectWithValue(e.message)
        }
    }
)

export const fetchChangeStatusOrderDelivery = createAsyncThunk(
    'deliveries/fetchChangeNumberOrder',
    async ({deliveryId, orderId, newStatus}: { deliveryId: string, orderId: string, newStatus: string }, thunkAPI) => {
        try {
            const deliveryDocRef = doc(db, 'deliveries', deliveryId);
            const deliveryDoc = await getDoc(deliveryDocRef)
            const deliveryData = deliveryDoc.data()
            const orders = deliveryData?.orders || []
            const orderIndex = orders.findIndex((order: IOrder) => order.id === orderId)
            orders[orderIndex]['status.statusName'] = newStatus;
            orders[orderIndex]['status.date'] = serverTimestamp()
            await updateDoc(deliveryDocRef, {
                orders: orders
            })
            console.log(newStatus)
            thunkAPI.dispatch(changeStatusOrderDelivery({orderId, newStatus, deliveryId}))
        } catch (e: any) {
            thunkAPI.rejectWithValue(e.message)
        }
    }
)
export const fetchChangeOrderDelivery = createAsyncThunk(
    'deliveries/fetchChangeOrder',
    async ({
               deliveryId,
               orderId,
               newStatus,
               newComment,
               newNumber
           }: { orderId: string, newStatus: string, newComment: string, newNumber: string, deliveryId: string }, thunkAPI) => {
        try {
            const deliveryDocRef = doc(db, 'deliveries', deliveryId);
            const deliveryDoc = await getDoc(deliveryDocRef)
            const deliveryData = deliveryDoc.data()
            const orders = deliveryData?.orders || []
            const orderIndex = orders.findIndex((order: IOrder) => order.id === orderId)
            orders[orderIndex]['status.statusName'] = newStatus
            orders[orderIndex]['comment'] = newComment
            orders[orderIndex]['number'] = newNumber
            await updateDoc(deliveryDocRef, {
                orders: orders
            })
            thunkAPI.dispatch(changeOrderDelivery({orderId, newStatus, newComment, newNumber, deliveryId}))
        } catch (e: any) {
            thunkAPI.rejectWithValue(e.message)
        }
    }
)

export const fetchDeleteDelivery = createAsyncThunk(
    'chats/fetchDeleteMessage',
    async ({delivery_id}: { delivery_id: string }, thunkAPI) => {
        try {
            const messageRef = doc(db, `deliveries`, delivery_id);
            await deleteDoc(messageRef)
            await thunkAPI.dispatch(deleteDelivery(delivery_id))
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message)
        }
    }
)

export const fetchChangeWeightDelivery = createAsyncThunk(
    'chats/fetchChangeWeightDelivery',
    async ({deliveryId, weight, width, height, length}:
               { deliveryId: string, weight: number, width: string, height: string, length: string }, thunkAPI) => {
        try {
            const deliveryDocRef = doc(db, 'deliveries', deliveryId)
            const newData = {
                weight: weight,
                'sizeSm.width': +width,
                'sizeSm.height': +height,
                'sizeSm.length': +length
            }
            await updateDoc(deliveryDocRef, newData)
            await thunkAPI.dispatch(changeWeight([deliveryId, weight]))
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message)
        }
    }
)
const DeliveriesSlice = createSlice({
    name: 'deliveries',
    initialState,
    reducers: {
        getAllDeliveries(state, action) {
            state.deliveries = action.payload
        },
        searchDelivery(state, action) {
            const [number, startDate, endDate, status, methods, uid] = action.payload
            if (number === '' && startDate === '' && endDate === '' && !Object.values(status).includes(true) && !Object.values(methods).includes(true)) {
                state.isSearching = false
                return
            }
            state.isSearching = true
            state.filteredDeliveries = state.deliveries.filter(delivery => {
                const orderDate = delivery.creationDate
                return (uid === '' || delivery.uid === uid) &&
                    (number === '' || delivery.number.includes(number)) &&
                    (startDate === '' || orderDate >= startDate) &&
                    (endDate === '' || orderDate <= endDate) &&
                    (!Object.values(status).includes(true) || status[delivery.status.statusName]) &&
                    (!Object.values(methods).includes(true) || methods[delivery.deliveryMethod])
            })
            if (state.isSorting) {
                state.filteredSortedDeliveries = [...state.filteredDeliveries].sort((a, b) => {
                    const dateA = +a.creationDate
                    const dateB = +b.creationDate
                    return state.paramSort ? dateA - dateB : dateB - dateA
                })
            }
        },
        clearSearchDelivery(state) {
            state.isSearching = false
            state.filteredDeliveries = []
        },
        changeDelivery(state, action) {
            const currentTimeInSeconds = Math.floor(Date.now() / 1000).toString()
            const {deliveryId, newStatus, newComment, newNumber} = action.payload
            state.deliveries = state.deliveries.map(delivery =>
                delivery.id === deliveryId ? {
                    ...delivery,
                    status: {statusName: newStatus, date: currentTimeInSeconds},
                    comment: newComment,
                    number: newNumber
                } : delivery
            ) as IDelivery[]
        },
        resetStatus(state) {
            state.status = null
            state.statusGet = null
        },
        calculateDeliveryCost(state, action) {
            const {deliveryId, deliveryCostRu, deliveryCostYen} = action.payload
            console.log(deliveryCostRu)
            state.deliveries = state.deliveries.map(delivery =>
                delivery.id === deliveryId ? {
                    ...delivery,
                    deliveryCost: deliveryCostRu,
                    deliveryCostYen: deliveryCostYen
                } : delivery
            ) as IDelivery[]
            console.log(state.deliveries)
        },
        cancelDelivery(state, action) {
            const currentTimeInSeconds = Math.floor(Date.now() / 1000).toString()
            const {deliveryId} = action.payload
            const newDelivery = {...state.deliveries.filter(order => order.id === deliveryId)[0]}
            newDelivery.status.statusName = 'Отменен'
            newDelivery.status.date = currentTimeInSeconds
            newDelivery.orders.map(order => {
                order.status.statusName = 'На складе в Японии'
                order.status.date = currentTimeInSeconds
            })
            state.deliveries = state.deliveries.map(delivery => delivery.id === deliveryId
                ? newDelivery
                : delivery
            ) as IDelivery[]
        },
        changeStatusOrderDelivery(state, action) {
            const currentTimeInSeconds = Math.floor(Date.now() / 1000).toString()
            const {orderId, newStatus, deliveryId} = action.payload
            const delivery = state.deliveries.filter(delivery => delivery.id === deliveryId)[0]
            if (delivery) {
                const newOrders = delivery.orders.map(order =>
                    order.id === orderId ? {
                        ...order,
                        status: {...order.status, statusName: newStatus, date: currentTimeInSeconds}
                    } : order
                )
                const updatedDelivery = {...delivery, orders: newOrders}
                state.deliveries = state.deliveries.map(d =>
                    d.id === deliveryId ? updatedDelivery : d
                );
            }
        },
        changeOrderDelivery(state, action) {
            const currentTimeInSeconds = Math.floor(Date.now() / 1000).toString()
            const {orderId, newStatus, newComment, newNumber, deliveryId} = action.payload
            const delivery = state.deliveries.filter(delivery => delivery.id === deliveryId)[0]

            if (delivery) {
                const newOrders = delivery.orders.map(order =>
                    order.id === orderId ? {
                        ...order,
                        comment: newComment,
                        number: newNumber,
                        status: {...order.status, statusName: newStatus, date: currentTimeInSeconds}
                    } : order
                )
                const updatedDelivery = {...delivery, orders: newOrders}
                state.deliveries = state.deliveries.map(d =>
                    d.id === deliveryId ? updatedDelivery : d
                );
            }
        },
        changeDeliverySnapshot(state, action) {
            state.deliveries = state.deliveries.map(delivery => {
                if (delivery.id === action.payload.id) {
                    return {...action.payload}
                }
                return {...delivery}
            })
        },
        pushNewDeliverySnapshot(state, action) {
            state.deliveries = [...state.deliveries, action.payload]
        },
        deleteDeliverySnapshot(state, action) {
            state.deliveries = [...state.deliveries.filter(delivery => delivery.id !== action.payload)]
        },
        sortDeliveries(state, action) {
            state.isSorting = true
            state.sortedDeliveries = [...state.deliveries]
            state.paramSort = action.payload
            state.sortedDeliveries.sort((a, b) => {
                const dateA = +a.creationDate
                const dateB = +b.creationDate
                return action.payload ? dateA - dateB : dateB - dateA
            })
            state.filteredSortedDeliveries = [...state.filteredDeliveries]
            state.filteredSortedDeliveries.sort((a, b) => {
                const dateA = +a.creationDate
                const dateB = +b.creationDate
                return action.payload ? dateA - dateB : dateB - dateA
            })
        },
        resetSort(state) {
            state.isSorting = false
            state.paramSort = null
        },
        deleteDelivery(state, action) {
            state.deliveries = state.deliveries.filter(delivery => delivery.id !== action.payload)
        },
        changeWeight(state, action) {
            const [deliveryId, weight] = action.payload;
            const deliveryIndex = state.deliveries.findIndex(delivery => delivery.id === deliveryId);
            if (deliveryIndex !== -1) {
                const updatedDelivery = {
                    ...state.deliveries[deliveryIndex],
                    weight: weight
                }
                state.deliveries = [
                    ...state.deliveries.slice(0, deliveryIndex),
                    updatedDelivery,
                    ...state.deliveries.slice(deliveryIndex + 1)
                ];
            } else {
                console.warn(`Delivery with ID ${deliveryId} not found.`);
            }
        }

    },

    extraReducers: builder => {
        builder
            .addCase(fetchGetAllDeliveries.fulfilled, (state, action) => {
                state.statusGet = 'succeeded';
                state.error = null;
            })
            .addCase(fetchGetAllDeliveries.rejected, (state, action) => {
                state.statusGet = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchGetAllDeliveries.pending, (state, action) => {
                state.statusGet = 'loading';
            })
            .addCase(fetchDeleteDelivery.fulfilled, (state, action) => {
                state.statusDelete = 'succeeded';
                state.error = null;
            })
            .addCase(fetchDeleteDelivery.rejected, (state, action) => {
                state.statusDelete = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchDeleteDelivery.pending, (state, action) => {
                state.statusDelete = 'loading';
            })
            .addMatcher(
                (action) =>
                    [fetchChangeDelivery.pending.type, fetchCalculateDeliveryCost.pending.type, fetchChangeOrderDelivery.pending.type,
                        fetchCancelDelivery.pending.type, fetchChangeStatusOrderDelivery.pending.type, fetchChangeWeightDelivery.pending.type].includes(action.type),
                (state, action: PayloadAction<string>) => {
                    state.status = 'loading'
                }
            )
            .addMatcher(
                (action) =>
                    [fetchChangeDelivery.fulfilled.type, fetchCalculateDeliveryCost.fulfilled.type, fetchChangeOrderDelivery.fulfilled.type,
                        fetchCancelDelivery.fulfilled.type, fetchChangeStatusOrderDelivery.fulfilled.type, fetchChangeWeightDelivery.fulfilled.type].includes(action.type),
                (state, action: PayloadAction<string>) => {
                    state.status = 'succeeded'
                    state.error = null
                }
            )
            .addMatcher(
                (action) =>
                    [fetchChangeDelivery.rejected.type, fetchCalculateDeliveryCost.rejected.type, fetchChangeOrderDelivery.rejected.type,
                        fetchCancelDelivery.rejected.type, fetchChangeStatusOrderDelivery.rejected.type, fetchChangeWeightDelivery.rejected.type].includes(action.type),
                (state, action: PayloadAction<string>) => {
                    state.status = 'failed'
                    state.error = action.payload as string
                }
            )
    }
})

export const DeliveriesReducer = DeliveriesSlice.reducer
export const {
    getAllDeliveries, searchDelivery, clearSearchDelivery,
    changeDelivery, resetStatus, calculateDeliveryCost,
    cancelDelivery, changeStatusOrderDelivery, changeOrderDelivery,
    changeDeliverySnapshot, pushNewDeliverySnapshot, deleteDeliverySnapshot,
    sortDeliveries, resetSort, deleteDelivery, changeWeight
} = DeliveriesSlice.actions