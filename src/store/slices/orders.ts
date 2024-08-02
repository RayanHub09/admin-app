import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {collection, db, getDocs, query} from "../../firebase";
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
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchGetAllOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGetAllOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null
            })
            .addMatcher(
                (action) =>
                    [ fetchGetAllOrders.rejected.type].includes(action.type),
                (state, action:PayloadAction<string> ) => {
                    state.status = 'failed'
                    state.error = action.payload as string
                }
            )
    }

})

export const OrderReducer = OrdersSlice.reducer
export const {getAllOrders, searchOrder} = OrdersSlice.actions