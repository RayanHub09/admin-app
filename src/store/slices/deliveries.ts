import {IDelivery, IOrder} from "../../interfaces"
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {collection, db, getDocs, query} from "../../firebase";
import serializeData from "../../Serializer";
import {fetchChangeStatusOrder, fetchGetAllOrders, getAllOrders} from "./orders";

interface IState {
    deliveries: IDelivery[]
    error: string|null
    status: 'loading' | 'succeeded' | 'failed' | null
}

const initialState:IState = {
    deliveries: [],
    error: null,
    status: null
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

        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

const DeliveriesSlice = createSlice({
    name: 'deliveries',
    initialState,
    reducers: {
        getAllDeliveries(state, action) {
            state.deliveries = action.payload
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchGetAllDeliveries.fulfilled, (state, action) => {
                state.status = null;
                state.error = null;
            })
            .addMatcher(
                (action) =>
                    [ fetchGetAllDeliveries.rejected.type].includes(action.type),
                (state, action:PayloadAction<string> ) => {
                    state.status = 'loading'
                }
            )
            .addMatcher(
                (action) =>
                    [ fetchGetAllDeliveries.rejected.type].includes(action.type),
                (state, action:PayloadAction<string> ) => {
                    state.status = 'failed'
                    state.error = action.payload as string
                }
            )
    }
})

export const DeliveriesReducer = DeliveriesSlice.reducer
export const {getAllDeliveries} = DeliveriesSlice.actions