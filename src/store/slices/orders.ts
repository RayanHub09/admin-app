import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {collection, db, getDocs, query} from "../../firebase";
import { Timestamp } from "firebase/firestore";
import serializeData from "../../Serializer";

interface IPart {
    discontinued: boolean
    discontinuedTitleEn: string
    discontinuedTitleRu: string
    markName: string
    name: string
    nameEn: string
    nameRu: string
    notOriginalReplacements: string[]
    oldPartNumbers: string[]
    partNo: string
    priceEur: number
    priceRub: number
    priceUsd: number
    priceYen: number
    sameTimeReplacements: string[]
    weight: number
}

interface IItem {
    id: string
    amount: number
    comment: string
    part: IPart
    selected: boolean
}
interface IStatus {
    archived: false
    date: any
    readyToPackage: boolean
    statusName: string
}
interface IOrder {
    id: string
    comment: string
    date: any
    items: IItem[]
    itemsCnt: number
    number: string
    priceRu: number
    priceYen: number
    status: IStatus
    uid: string
}
interface IState {
    orders: IOrder[]
    error: string|null
    status: 'loading' | 'succeeded' | 'failed' | null
}
const initialState:IState = {
    orders: [],
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
export const {getAllOrders} = OrdersSlice.actions