import {IDelivery, IOrder} from "../../interfaces"
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {collection, db, deleteDoc, doc, getDocs, query, updateDoc} from "../../firebase";
import serializeData from "../../Serializer";
import {fetchChangeStatusOrder, fetchGetAllOrders, getAllOrders} from "./orders";

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

export const fetchDeleteDelivery = createAsyncThunk(
    'deliveries/fetchDeleteDelivery',
    async (deliveryId:string, thunkAPI) => {
       try {
           const deliveryDocRef = doc(db, 'deliveries', deliveryId)
           // await deleteDoc(deliveryDocRef)
           thunkAPI.dispatch(deleteDelivery({deliveryId}))
       } catch (e:any) {
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
        searchDelivery(state, action: PayloadAction<string>) {
            const query = action.payload.trim()
            if (query === '') {
                state.isSearching = false
                state.filteredDeliveries = state.deliveries
            }
            else {
                state.filteredDeliveries = state.deliveries.filter(delivery =>
                    delivery.number.includes(query)
                )
                state.isSearching = true
            }
        },
        clearSearch(state) {
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
        deleteDelivery(state, action) {
            const {deliveryId} = action.payload
            state.deliveries = state.deliveries.filter(delivery => delivery.id !== deliveryId)
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
                    [fetchChangeDelivery.pending.type, fetchCalculateDeliveryCost.pending.type,
                    fetchDeleteDelivery.pending.type].includes(action.type),
                (state, action:PayloadAction<string> ) => {
                    state.status = 'loading'
                }
            )
            .addMatcher(
                (action) =>
                    [fetchChangeDelivery.fulfilled.type, fetchCalculateDeliveryCost.fulfilled.type,
                    fetchDeleteDelivery.fulfilled.type].includes(action.type),
                (state, action:PayloadAction<string> ) => {
                    state.status = 'succeeded'
                    state.error = null
                }
            )
            .addMatcher(
                (action) =>
                    [fetchChangeDelivery.rejected.type, fetchCalculateDeliveryCost.rejected.type,
                    fetchDeleteDelivery.rejected.type].includes(action.type),
                (state, action:PayloadAction<string> ) => {
                    state.status = 'failed'
                    state.error = action.payload as string
                }
            )
    }
})

export const DeliveriesReducer = DeliveriesSlice.reducer
export const {getAllDeliveries, searchDelivery, clearSearch,
                changeDelivery, resetStatus, calculateDeliveryCost,
                deleteDelivery} = DeliveriesSlice.actions