import {IOrder, IUser} from "../../interfaces";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {collection, db, deleteDoc, doc, getDocs, query} from "../../firebase";
import serializeData from "../../Serializer";
import {deleteManager, fetchGetAllManagers} from "./managers";
import {getAuth} from "firebase/auth";



interface IState {
    users: IUser[]
    filteredUsers: IUser[]
    error: string | null
    status: 'loading' | 'succeeded' | 'failed' | null
    statusGet: 'loading' | 'succeeded' | 'failed' | null
    statusDelete: 'loading' | 'succeeded' | 'failed' | null
    isSearching: boolean
}

const initialState:IState = {
    users: [],
    filteredUsers: [],
    error: null,
    status: null,
    statusGet: null,
    statusDelete: null,
    isSearching: false
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

export const fetchDeleteUser = createAsyncThunk(
    'managers/fetchDeleteManager',
    async ({user_id}: {user_id: string}, thunkAPI) => {
        try {
            const messageRef = doc(db, `users`, user_id);
            await deleteDoc(messageRef)
            await thunkAPI.dispatch(deleteUser(user_id))

            const auth = getAuth()
            const user = auth.currentUser
            if (!user) {
                return thunkAPI.rejectWithValue("Пользователь не аутентифицирован")
            }
            await user.delete()

        } catch (e:any) {
            return thunkAPI.rejectWithValue(e.message)
        }
    }
)

const UsersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        getAllUsers(state, action) {
            state.users = [...action.payload]
        },
        clearSearch(state) {
          state.isSearching = false
          state.filteredUsers = []
        },
        searchUser(state, action) {
            const [name, surname, patronymic, phoneNumber, email] = action.payload
            if (name === '' && surname === '' && email === '' && phoneNumber === '' && patronymic === '') {
                state.isSearching = false
            }
            state.isSearching = true
            state.filteredUsers = state.users.filter(user => {
                return (name === '' || user.name.includes(name)) &&
                    (surname === '' || user.surname.includes(surname)) &&
                    (patronymic === '' || user.patronymic.includes(patronymic)) &&
                    (phoneNumber === '' || user.phoneNumber.includes(phoneNumber)) &&
                    (email === '' || user.email.includes(email))
            })
        },
        deleteUser(state, action) {
            state.users = state.users.filter(user => user.id !== action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeleteUser.fulfilled, (state) => {
                state.statusDelete = 'succeeded'
                state.error = null
            })
            .addCase(fetchDeleteUser.rejected, (state, action) => {
                state.statusDelete = 'failed'
                state.error = action.payload as string
            })
            .addCase(fetchDeleteUser.pending, (state) => {
                state.statusDelete = 'loading'
                state.error = null
            })
    }
})

export const UserReducer = UsersSlice.reducer
export const {
    getAllUsers, searchUser, clearSearch, deleteUser
} = UsersSlice.actions