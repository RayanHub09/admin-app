import {IOrder, IUser} from "../../interfaces";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {collection, db, getDocs, query} from "../../firebase";
import serializeData from "../../Serializer";



interface IState {
    users: IUser[]
    error: string | null
    status: 'loading' | 'succeeded' | 'failed' | null
    statusGet: 'loading' | 'succeeded' | 'failed' | null
}

const initialState:IState = {
    users: [],
    error: null,
    status: null,
    statusGet: null
}
export const fetchGetAllUsers = createAsyncThunk(
    'users/fetchGetAllUsers',
    async (arg, thunkAPI) => {
        try {
            const q = query(collection(db, "users"))
            const querySnapshot = await getDocs(q)
            const users: IUser[] = querySnapshot.docs.map(doc => {
                const serializedData = serializeData(
                    {
                        id: doc.id,
                        ...doc.data()
                    }
                )
                return serializedData as IUser
            })
            thunkAPI.dispatch(getAllUsers(users))
        } catch (e) {

        }
    }
)
const UsersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        getAllUsers(state, action) {
            state.users = [...action.payload]
        }
    }
})

export const UserReducer = UsersSlice.reducer
export const {
    getAllUsers
} = UsersSlice.actions