import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createUserWithEmailAndPassword, getAuth, UserCredential} from "firebase/auth";
import {collection, db, addDoc, query, getDocs} from "../../firebase";
import {IManager} from "../../interfaces";

interface IAuthManager {
    id: string | null
    email: string | null
    role: string | null
    name: string | null
}


interface IState {
    managers: IManager[]
    error: string | null
    status: 'loading' | 'succeeded' | 'failed' | null
}

const initialState: IState = {
    managers: [],
    error: null,
    status: null
}
export const fetchSignUpManager = createAsyncThunk(
    'worker/fetchCreateWorker',
    async ({email, password, role, name}: { email: string; password: string; role: string, name: string }, thunkAPI) => {
        try {
            const userCredential: UserCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
            const newManager: IAuthManager = {
                id: userCredential.user.uid,
                email,
                role,
                name
            }
            await addDoc(collection(db, "managers"), newManager);
            thunkAPI.dispatch(addWorker(newManager));
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const fetchGetAllManagers = createAsyncThunk(
    'managers/fetchGetAllManagers',
    async (arg, thunkAPI) => {
        try {
            const q = query(collection(db, "managers"))
            const querySnapshot = await getDocs(q)
            const managers:IManager[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                email: doc.data().email,
                role: doc.data().role,
                name: doc.data().name
            }))
            return managers
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }

    }
)

const ManagersSlice = createSlice({
    name: 'Managers',
    initialState,
    reducers: {
        addWorker(state, action) {
            state.managers = [...state.managers, action.payload]
        },
        getAllManagers(state, action) {
            state.managers = action.payload
        },
        setError(state) {
            state.error = null
            state.status = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGetAllManagers.fulfilled, (state, action) => {
                state.managers = action.payload
                state.status = 'succeeded'
                state.error = null
            })
            .addMatcher(
                (action) =>
                    [fetchSignUpManager.pending.type].includes(action.type),
                (state) => {
                    state.status = 'loading'
                }
            )
            .addMatcher(
                (action) =>
                    [fetchSignUpManager.fulfilled.type, fetchGetAllManagers.fulfilled.type].includes(action.type),
                (state) => {
                    state.status = 'succeeded'
                    state.error = null
                }
            )
            .addMatcher(
                (action) =>
                    [fetchSignUpManager.rejected.type, fetchGetAllManagers.rejected.type].includes(action.type),
                (state, action: PayloadAction<string>) => {
                    state.status = 'failed'
                    state.error = action.payload as string
                }
            )
    }
})

export const ManagersReducer = ManagersSlice.reducer
export const {addWorker, getAllManagers, setError} = ManagersSlice.actions