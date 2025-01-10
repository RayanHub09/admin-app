import {IOrder, IUser} from "../../interfaces";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {collection, db, getDocs, query} from "../../firebase";
import serializeData from "../../Serializer";



interface IState {
    users: IUser[]
    filteredUsers: IUser[]
    error: string | null
    status: 'loading' | 'succeeded' | 'failed' | null
    statusGet: 'loading' | 'succeeded' | 'failed' | null
    isSearching: boolean
}

const initialState:IState = {
    users: [],
    filteredUsers: [],
    error: null,
    status: null,
    statusGet: null,
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
        }
    }
})

export const UserReducer = UsersSlice.reducer
export const {
    getAllUsers, searchUser, clearSearch
} = UsersSlice.actions