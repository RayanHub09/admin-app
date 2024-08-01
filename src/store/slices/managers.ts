import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createUserWithEmailAndPassword, getAuth, UserCredential} from "firebase/auth";
import {collection, db, addDoc} from "../../firebase";


interface IWorker {
    id: string | null
    email: string | null
    role: string | null
}

interface IState {
    managers: IWorker[]
    error: string | null
    status: string | null
}

const initialState:IState = {
    managers: [],
    error: null,
    status: null
}
export const fetchSignUpManager = createAsyncThunk(
    'worker/fetchCreateWorker',
    async ({ email, password, role }: { email: string; password: string; role: string }, thunkAPI) => {
        try {
            console.log(0)
            const userCredential: UserCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
            const newManager: IWorker = {
                id: userCredential.user.uid,
                email,
                role,
            };

            await addDoc(collection(db, "managers"), newManager);
            thunkAPI.dispatch(addWorker(newManager));
        } catch (error: any) {
            console.log(error)
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
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) =>
                    [fetchSignUpManager.pending.type].includes(action.type),
                (state) => {
                    state.status = 'loading'
                }
            )
            .addMatcher(
                (action) =>
                    [fetchSignUpManager.fulfilled.type].includes(action.type),
                (state) => {
                    state.status = 'succeeded'
                    state.error = null
                }
            )
            .addMatcher(
                (action) =>
                    [fetchSignUpManager.rejected.type].includes(action.type),
                (state, action:PayloadAction<string>) => {
                    state.status = 'failed'
                    state.error = action.payload as string
                }
            )
    }
})

export const ManagersReducer = ManagersSlice.reducer
export const {addWorker} = ManagersSlice.actions