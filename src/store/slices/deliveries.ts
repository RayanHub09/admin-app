import {IDelivery, IOrder} from "../../interfaces"
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {collection, db, doc, getDoc, getDocs, query, updateDoc} from "../../firebase";
import serializeData from "../../Serializer";
import {convertStringToDate, getDate} from "../../functions/changeDate";
import {RootState} from "../index";
import {arrayUnion} from "firebase/firestore";


interface IState {
    deliveries: IDelivery[]
    error: string|null
    isSearching: boolean
    filteredDeliveries: IDelivery[]
    status: 'loading' | 'succeeded' | 'failed' | null
    statusGet: 'loading' | 'succeeded' | 'failed' | null
}

const initialState:IState = {
    deliveries: [],
    error: null,
    isSearching: false,
    filteredDeliveries: [],
    status: null,
    statusGet: null
}

export const fetchGetAllDeliveries = createAsyncThunk(
    'deliveries/fetchGetAllDeliveries',
    async (arg, thunkAPI) => {
        try {
            const q = query(collection(db, "deliveries"))
            const querySnapshot = await getDocs(q)
            const deliveries: IDelivery[] = querySnapshot.docs.map(doc => {
                const data = doc.data()
                const serializedData = serializeData(
                    {
                        id: doc.id,
                        creationDate: data.creationDate.seconds,
                        ...data,
                        status: {
                            date: data.status.date.seconds,
                            ...data.status,
                        }
                    }
                )
                return serializedData as IDelivery
            })
            thunkAPI.dispatch(getAllDeliveries(deliveries))
            return deliveries
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const fetchChangeDelivery = createAsyncThunk(
    'deliveries/fetchChangeDelivery',
    async ({deliveryId, newStatus, newComment, newNumber} : {deliveryId: string, newStatus: string, newComment: string, newNumber: string }, thunkAPI) => {
        const deliveryDocRef = doc(db, 'deliveries', deliveryId)
        try {
            const updateData: { [key: string]: string } = {};
            if (newStatus !== undefined) updateData['status.statusName'] = newStatus;
            if (newComment !== undefined) updateData['comment'] = newComment;
            if (newNumber !== undefined) updateData['number'] = newNumber;
            await updateDoc(deliveryDocRef, updateData)
            const updatedDelivery = {deliveryId, newStatus, newComment, newNumber}
            thunkAPI.dispatch(changeDelivery(updatedDelivery))
        } catch (e:any) {
            thunkAPI.rejectWithValue(e.message)
        }
    }
)
export const  fetchCalculateDeliveryCost = createAsyncThunk(
    'deliveries/fetchCalculateDeliveryCost',
    async ({deliveryId, deliveryCostRu, deliveryCostYen} : {deliveryId:string, deliveryCostRu:number, deliveryCostYen:number}, thunkAPI) => {
        try {
            const deliveryDocRef = doc(db, 'deliveries', deliveryId)
            const newData = {
                deliveryCost : deliveryCostRu,
                deliveryCostYen : deliveryCostYen
            }
            await updateDoc(deliveryDocRef, newData)
            const updateDelivery = {deliveryId, deliveryCostRu, deliveryCostYen}
            thunkAPI.dispatch(calculateDeliveryCost(updateDelivery))
        } catch (e:any) {
            thunkAPI.rejectWithValue(e.message)
        }
    }
)

export const fetchCancelDelivery = createAsyncThunk(
    'deliveries/fetchDeleteDelivery',
    async ({deliveryId}:{deliveryId: string}, thunkAPI) => {
       try {
           const deliveryDocRef = doc(db, 'deliveries', deliveryId)
           const deliveryDoc = await getDoc(deliveryDocRef)
           const deliveryData = deliveryDoc.data()
           const updatedOrders = deliveryData?.orders.map((order:IOrder) => ({
               ...order,
               ['status.statusName'] : 'На складе в Японии'
           }))
           await updateDoc(deliveryDocRef, {
               ['status.statusName'] : 'Отменен',
               orders: updatedOrders
           })
           thunkAPI.dispatch(cancelDelivery({ deliveryId }));

       } catch (e:any) {
           thunkAPI.rejectWithValue(e.message)
       }
    }
)

export const fetchChangeStatusOrderDelivery = createAsyncThunk(
    'deliveries/fetchChangeNumberOrder',
    async ({deliveryId, orderId, newStatus} : {deliveryId: string, orderId: string, newStatus: string}, thunkAPI) => {
        try {
            const deliveryDocRef = doc(db, 'deliveries', deliveryId);
            const deliveryDoc = await getDoc(deliveryDocRef)
            const deliveryData = deliveryDoc.data()
            const orders = deliveryData?.orders || []
            const orderIndex = orders.findIndex((order: IOrder) => order.id === orderId)
            orders[orderIndex]['status.statusName']  = newStatus;
            await updateDoc(deliveryDocRef, {
                orders: orders
            })
            console.log(newStatus)
            thunkAPI.dispatch(changeStatusOrderDelivery({orderId, newStatus, deliveryId}))
        } catch (e:any) {
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
            orders[orderIndex]['status.statusName']  = newStatus
            orders[orderIndex]['comment'] = newComment
            orders[orderIndex]['number'] = newNumber
            await updateDoc(deliveryDocRef, {
                orders: orders
            })
            console.log(orders)
            thunkAPI.dispatch(changeOrderDelivery({orderId, newStatus, newComment, newNumber, deliveryId}))
        } catch (e: any) {
            thunkAPI.rejectWithValue(e.message)
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
            const [number, startDate, endDate, status, methods] = action.payload
            if (number === '' && startDate === '' && endDate === '' && !Object.values(status).includes(true) && !Object.values(methods).includes(true)) {
                state.isSearching = false
                return
            }
            state.isSearching = true
            state.filteredDeliveries = state.deliveries.filter(delivery => {
                const orderDate = convertStringToDate(getDate(delivery.creationDate)[1]).getTime()
                return (number === '' || delivery.number.includes(number)) &&
                    (startDate === '' || orderDate >= convertStringToDate(startDate).getTime()) &&
                    (endDate === '' || orderDate <= convertStringToDate(endDate ).getTime()) &&
                    (!Object.values(status).includes(true)   || status[delivery.status.statusName]) &&
                    (!Object.values(methods).includes(true)   || methods[delivery.deliveryMethod])
            })
        },
        clearSearchDelivery(state) {
            state.isSearching = false
            state.filteredDeliveries = []
        },
        changeDelivery(state, action) {
            const { deliveryId, newStatus, newComment, newNumber } = action.payload
            state.deliveries = state.deliveries.map(delivery =>
                delivery.id === deliveryId ? { ...delivery, status: { statusName: newStatus }, comment: newComment, number: newNumber } : delivery
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
                delivery.id === deliveryId ? {...delivery, deliveryCost : deliveryCostRu, deliveryCostYen: deliveryCostYen} : delivery
            ) as IDelivery[]
            console.log(state.deliveries)
        },
        cancelDelivery(state, action) {
            const {deliveryId} = action.payload
            const newDelivery = {...state.deliveries.filter(order => order.id === deliveryId)[0]}
            newDelivery.status.statusName = 'Отменен'
            newDelivery.orders.map(order => order.status.statusName = 'На складе в Японии')
            state.deliveries = state.deliveries.map(delivery => delivery.id === deliveryId
                ? newDelivery
                : delivery
            ) as IDelivery[]
        },
        changeStatusOrderDelivery(state, action) {
            const { orderId, newStatus, deliveryId } = action.payload
            const delivery = state.deliveries.filter(delivery => delivery.id === deliveryId)[0]

            if (delivery) {
                const newOrders = delivery.orders.map(order =>
                    order.id === orderId ? { ...order, status: { ...order.status, statusName: newStatus } } : order
                )
                const updatedDelivery = { ...delivery, orders: newOrders }
                state.deliveries = state.deliveries.map(d =>
                    d.id === deliveryId ? updatedDelivery : d
                );
            }
        },
        changeOrderDelivery(state, action) {
            const { orderId, newStatus, newComment, newNumber, deliveryId } = action.payload
            const delivery = state.deliveries.filter(delivery => delivery.id === deliveryId)[0]

            if (delivery) {
                const newOrders = delivery.orders.map(order =>
                    order.id === orderId ? { ...order, comment: newComment, number: newNumber, status: { ...order.status, statusName: newStatus } } : order
                )
                const updatedDelivery = { ...delivery, orders: newOrders }
                state.deliveries = state.deliveries.map(d =>
                    d.id === deliveryId ? updatedDelivery : d
                );
            }
        },
        changeDeliverySnapshot(state, action) {
            state.deliveries = state.deliveries.map(delivery => {
                if (delivery.id === action.payload.id) {
                    return {... action.payload}
                }
                return {...delivery}
            })
        },
        pushNewDeliverySnapshot(state, action) {
            state.deliveries = [...state.deliveries, action.payload]
        },
        deleteDeliverySnapshot(state, action) {
            state.deliveries = [...state.deliveries.filter(delivery => delivery.id !== action.payload)]
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
            .addMatcher(
                (action) =>
                    [fetchChangeDelivery.pending.type, fetchCalculateDeliveryCost.pending.type, fetchChangeOrderDelivery.pending.type,
                    fetchCancelDelivery.pending.type, fetchChangeStatusOrderDelivery.pending.type].includes(action.type),
                (state, action:PayloadAction<string> ) => {
                    state.status = 'loading'
                }
            )
            .addMatcher(
                (action) =>
                    [fetchChangeDelivery.fulfilled.type, fetchCalculateDeliveryCost.fulfilled.type, fetchChangeOrderDelivery.fulfilled.type,
                        fetchCancelDelivery.fulfilled.type, fetchChangeStatusOrderDelivery.fulfilled.type].includes(action.type),
                (state, action:PayloadAction<string> ) => {
                    state.status = 'succeeded'
                    state.error = null
                }
            )
            .addMatcher(
                (action) =>
                    [fetchChangeDelivery.rejected.type, fetchCalculateDeliveryCost.rejected.type, fetchChangeOrderDelivery.rejected.type,
                        fetchCancelDelivery.rejected.type, fetchChangeStatusOrderDelivery.rejected.type].includes(action.type),
                (state, action:PayloadAction<string> ) => {
                    state.status = 'failed'
                    state.error = action.payload as string
                }
            )
    }
})

export const DeliveriesReducer = DeliveriesSlice.reducer
export const {getAllDeliveries, searchDelivery, clearSearchDelivery,
    changeDelivery, resetStatus, calculateDeliveryCost,
    cancelDelivery,changeStatusOrderDelivery, changeOrderDelivery,
    changeDeliverySnapshot, pushNewDeliverySnapshot, deleteDeliverySnapshot
} = DeliveriesSlice.actions