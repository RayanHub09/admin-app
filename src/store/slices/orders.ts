import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {collection, db, doc, getDocs, query, updateDoc} from "../../firebase";
import {IOrder} from "../../interfaces"
import {convertStringToDate, getDate} from "../../functions/changeDate";
import {serverTimestamp, Timestamp} from "firebase/firestore";
import firebase from "firebase/compat";


interface IState {
    orders: IOrder[]
    filteredOrders: IOrder[]
    sortedOrders: IOrder[]
    filteredSortedOrders: IOrder[]
    paramSort: boolean | null
    isSearching: boolean
    isSorting: boolean
    error: string | null
    status: 'loading' | 'succeeded' | 'failed' | null
    statusGet: 'loading' | 'succeeded' | 'failed' | null
}

const initialState: IState = {
    orders: [],
    filteredOrders: [],
    filteredSortedOrders: [],
    sortedOrders: [],
    isSearching: false,
    isSorting: false,
    paramSort: null,
    error: null,
    status: null,
    statusGet: null
}

export const fetchGetAllOrders = createAsyncThunk(
    'orders/fetchGetAllOrders',
    async (arg, thunkAPI) => {
        try {
            const q = query(collection(db, "orders"));
            const querySnapshot = await getDocs(q);
            const orders: IOrder[] = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const serializedData: IOrder = {
                    id: doc.id,
                    comment: data.comment,
                    date: data.date.seconds,
                    items: data.items,
                    itemsCnt: data.itemsCnt,
                    number: data.number,
                    priceRu: data.priceRu,
                    priceYen: data.priceYen,
                    uid: data.uid,
                    status: {
                        archived: data.status.archived || false,
                        date: data.status.date.seconds,
                        readyToPackage: data.status.readyToPackage,
                        statusName: data.status.statusName
                    }
                }
                return serializedData;
            });

            thunkAPI.dispatch(getAllOrders(orders));
            return orders;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const fetchChangeStatusOrder = createAsyncThunk(
    'orders/fetchChangeStatusOrder',
    async ({orderId, newStatus}: { orderId: string, newStatus: string,}, thunkAPI) => {
        const orderDocRef = doc(db, 'orders', orderId)
        try {
            await updateDoc(orderDocRef, {
                'status.statusName': newStatus,
                'status.date': serverTimestamp()
            })
            thunkAPI.dispatch(changeStatusOrder({orderId, newStatus}))
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const fetchChangeOrder = createAsyncThunk(
    'orders/fetchChangeOrder',
    async ({
               orderId,
               newStatus,
               newComment,
               newNumber
           }: { orderId: string, newStatus: string, newComment: string, newNumber: string }, thunkAPI) => {
        try {
            const orderDocRef = doc(db, 'orders', orderId);
            const updateData: { [key: string]: string|any } = {};
            if (newStatus !== undefined) {
                updateData['status.statusName'] = newStatus
                updateData['status.date'] = serverTimestamp()
            }
            if (newComment !== undefined) updateData['comment'] = newComment;
            if (newNumber !== undefined) updateData['number'] = newNumber;
            await updateDoc(orderDocRef, updateData)
            const updatedOrder = {orderId, newStatus, newComment, newNumber};
            thunkAPI.dispatch(changeOrder(updatedOrder))
            return updatedOrder;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)
export const fetchCancelOrder = createAsyncThunk(
    'orders/fetchDeleteOrder',
    async (orderId: string, thunkAPI) => {
        try {
            const orderDocRef = doc(db, 'orders', orderId)
            await updateDoc(orderDocRef, {['status.statusName']: 'Отменен', ['status.date']: serverTimestamp()})
            thunkAPI.dispatch(cancelOrder({orderId}))
        } catch (e: any) {
            thunkAPI.rejectWithValue(e.message)
        }
    }
)
const OrdersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        getAllOrders(state, action) {
            state.orders = [...action.payload]
        },
        searchOrder(state, action) {
            const [number, startDate, endDate, status, uid] = action.payload;
            if (number === '' && startDate === '' && endDate === '' && !Object.values(status).includes(true)) {
                state.isSearching = false
                return
            }
            state.isSearching = true
            state.filteredOrders = state.orders.filter(order => {
                const orderDate = order.date
                return (order.uid === uid || uid === '') &&
                    (number === '' || order.number.includes(number)) &&
                    (startDate === '' || orderDate >= startDate) &&
                    (endDate === '' || orderDate <= endDate) &&
                    (!Object.values(status).includes(true)   || status[order.status.statusName]);
            })
            if (state.isSorting) {
                state.filteredSortedOrders = [...state.filteredOrders].sort((a, b) => {
                    const dateA = +a.date
                    const dateB = +b.date
                    return state.paramSort ? dateA - dateB : dateB - dateA
                })
            }
        },
        changeStatusOrder(state, action) {
            const currentTimeInSeconds = Math.floor(Date.now() / 1000).toString()
            const {orderId, newStatus} = action.payload
            state.orders = state.orders.map(order =>
                order.id === orderId ? {...order, status: {statusName: newStatus, date: currentTimeInSeconds}} : order
            ) as IOrder[]
            state.filteredOrders = state.filteredOrders.map(order =>
                order.id === orderId ? {...order, status: {statusName: newStatus, date: currentTimeInSeconds}} : order
            ) as IOrder[]
        },
        changeOrder(state, action) {
            const currentTimeInSeconds = Math.floor(Date.now() / 1000).toString()
            const {orderId, newStatus, newComment, newNumber} = action.payload
            state.orders = state.orders.map(order =>
                order.id === orderId ? {
                    ...order,
                    status: {statusName: newStatus, date: currentTimeInSeconds},
                    comment: newComment,
                    number: newNumber
                } : order
            ) as IOrder[]
        },
        clearSearch(state) {
            state.isSearching = false
            state.filteredOrders = []
        },
        cancelOrder(state, action) {
            const currentTimeInSeconds = Math.floor(Date.now() / 1000).toString()
            const {orderId} = action.payload
            state.orders = state.orders.map(order => order.id === orderId ? {
                    ...order,
                    status: {statusName: 'Отменен'},
                    date: currentTimeInSeconds
                } : order
            ) as IOrder[]

        },
        resetStatus(state) {
            state.status = null
        },
        changeOrderSnapshot(state, action) {
            state.orders = state.orders.map(order => {
                if (order.id === action.payload.id) {
                    return {...action.payload}
                }
                return {...order}
            })
        },
        pushNewOrderSnapshot(state, action) {
            state.orders = [...state.orders, action.payload]
        },
        deleteOrderSnapshot(state, action) {
            state.orders = [...state.orders.filter(order => order.id !== action.payload)]
        },
        sortOrders(state, action) {
            state.isSorting = true
            state.sortedOrders = [...state.orders]
            state.paramSort = action.payload
            state.sortedOrders.sort((a, b) => {
                const dateA = +a.date
                const dateB = +b.date
                return action.payload ? dateA - dateB : dateB - dateA
            })
            state.filteredSortedOrders = [...state.filteredOrders]
            state.filteredSortedOrders.sort((a, b) => {
                const dateA = +a.date
                const dateB = +b.date
                return action.payload ? dateA - dateB : dateB - dateA
            })
        },
        resetSort(state) {
            state.isSorting = false
            state.paramSort = null
        }

    },
    extraReducers: builder => {
        builder
            .addCase(fetchGetAllOrders.pending, (state, action) => {
                state.statusGet = 'loading'
            })
            .addCase(fetchGetAllOrders.rejected, (state, action) => {
                state.statusGet = 'failed'
                state.error = action.payload as string
            })
            .addCase(fetchGetAllOrders.fulfilled, (state, action) => {
                state.statusGet = 'succeeded'
                state.error = null
            })
            .addMatcher(
                (action) =>
                    [fetchChangeStatusOrder.pending.type, fetchCancelOrder.pending.type,
                        fetchChangeOrder.pending.type
                    ].includes(action.type),
                (state, action: PayloadAction<string>) => {
                    state.status = 'loading'
                }
            )
            .addMatcher(
                (action) =>
                    [fetchChangeStatusOrder.fulfilled.type, fetchCancelOrder.fulfilled.type,
                        fetchChangeOrder.fulfilled.type
                    ].includes(action.type),
                (state, action: PayloadAction<string>) => {
                    state.status = 'succeeded'
                    state.error = null
                }
            )
            .addMatcher(
                (action) =>
                    [fetchChangeStatusOrder.rejected.type, fetchCancelOrder.rejected.type,
                        fetchChangeOrder.rejected.type
                    ].includes(action.type),
                (state, action: PayloadAction<string>) => {
                    state.status = 'failed'
                    state.error = action.payload as string
                }
            )
    }

})

export const OrderReducer = OrdersSlice.reducer
export const {
    getAllOrders, searchOrder, changeStatusOrder, changeOrder, resetSort, sortOrders,
    clearSearch, cancelOrder, resetStatus, changeOrderSnapshot, pushNewOrderSnapshot, deleteOrderSnapshot
} = OrdersSlice.actions