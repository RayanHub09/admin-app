import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {collection, db, doc, getDocs, query, updateDoc} from "../../firebase";
import { Timestamp } from "firebase/firestore";
import serializeData from "../../Serializer";
import {IOrder} from "../../interfaces";

interface IState {
    orders: IOrder[]
    filteredOrders: IOrder[]
    isSearching: boolean
    error: string|null
    status: 'loading' | 'succeeded' | 'failed' | null
}
const initialState:IState = {
    orders: [],
    filteredOrders: [],
    isSearching: false,
    error: null,
    status: null
}

export const fetchGetAllOrders = createAsyncThunk(
    'orders/fetchGetAllOrders',
    async (arg, thunkAPI) => {
        try {
            const q = query(collection(db, "orders"))
            const querySnapshot = await getDocs(q)
            const orders: IOrder[] = querySnapshot.docs.map(doc => {
                const data = doc.data()
                const serializedData = serializeData(
                    {
                        id: doc.id,
                        date: data.date.seconds,
                        ...doc.data(),
                        status: {
                            date: data.status.date.seconds,
                            ...doc.data().status,
                        }
                    }
                )
                return serializedData as IOrder
            })
            thunkAPI.dispatch(getAllOrders(orders))
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const fetchChangeStatusOrder = createAsyncThunk(
    'orders/fetchChangeStatusOrder',
    async ({orderId, newStatus} : {orderId: string, newStatus: string}, thunkAPI) => {
        const orderDocRef = doc(db, 'orders', orderId);
        try {
            await updateDoc(orderDocRef, {
                'status.statusName': newStatus
            })
            thunkAPI.dispatch(changeStatusOrder({orderId, newStatus}))
        } catch (error:any) {
            return thunkAPI.rejectWithValue(error.message);
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
        searchOrder(state, action: PayloadAction<string>) {
            const query = action.payload;
            if (query === '') state.isSearching = false
            else {
                state.filteredOrders = state.orders.filter(order =>
                    order.number.includes(query)
                )
                state.isSearching = true
            }
        },
        changeStatusOrder(state, action) {
            const { orderId, newStatus } = action.payload
            state.orders = state.orders.map(order =>
                order.id === orderId ? { ...order, status: { statusName: newStatus } } : order
            ) as IOrder[]
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchGetAllOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGetAllOrders.fulfilled, (state, action) => {
                state.status = null
                state.error = null
            })
            .addCase(fetchChangeStatusOrder.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchChangeStatusOrder.fulfilled, (state, action) => {
                state.status = null
                state.error = null
            })
            .addMatcher(
                (action) =>
                    [ fetchGetAllOrders.rejected.type, fetchChangeStatusOrder.rejected.type].includes(action.type),
                (state, action:PayloadAction<string> ) => {
                    state.status = 'failed'
                    state.error = action.payload as string
                }
            )
    }

})

export const OrderReducer = OrdersSlice.reducer
export const {getAllOrders, searchOrder, changeStatusOrder} = OrdersSlice.actions