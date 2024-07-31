import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import { getAuth, signInWithEmailAndPassword, UserCredential, createUserWithEmailAndPassword } from "firebase/auth";
import { db, collection, query, where, getDocs } from "../../firebase";


interface IWorker {
    id: string | null
    email: string | null
    role: string | null
}

interface IState {
    worker: IWorker
    error: string | null
    status: 'loading' | 'succeeded' | 'failed' | null
    isAuth: boolean
    token: string | null
}

const initialState: IState = {
    worker: {
        id: null,
        email: null,
        role: null
    },
    error: null,
    status: null,
    token: null,
    isAuth: false
}


export const fetchUserByEmail = createAsyncThunk(
    "user/fetchUserByEmail",
    async (email: string, thunkAPI) => {
            const q = query(collection(db, "workers"), where("email", "==", email));
            const querySnapshot = await getDocs(q);
            const userData: IWorker = querySnapshot.docs.map((doc) => {
                const data = doc.data() as IWorker; // Приведение типа данных
                return {
                    id: doc.id,
                    email: data.email,
                    role: data.role
                };
            })[0];
            thunkAPI.dispatch(setWorker(userData))
    }
);


export const fetchSignIn = createAsyncThunk(
    'user/signIn',
    async ({ email, password }: { email: string; password: string }, thunkAPI) => {
        try {
            const userCredential: UserCredential = await signInWithEmailAndPassword(getAuth(), email, password)
            const user = userCredential.user
            const token = await user.getIdToken()
            thunkAPI.dispatch(signIn({
                id: user.uid,
                token,
                email: user.email
            }))
            fetchUserByEmail(email)
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
);

export const fetchCreateWorker = createAsyncThunk(
    'worker/fetchCreateWorker',
    async ({ email, password }: { email: string; password: string }, thunkAPI) => {
        try {
            const userCredential: UserCredential =  await createUserWithEmailAndPassword(getAuth(), email, password)
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message)
        }

    }
)

const workerSlice = createSlice({
    name: 'worker',
    initialState,
    reducers: {
        signIn(state, action) {
            state.worker.id = action.payload.id
            state.worker.email = action.payload.email
            state.token = action.payload.token
        },
        setWorker(state, action) {
            state.worker.id = action.payload.id
            state.worker.email = action.payload.email
            state.worker.role = action.payload.role
        },
        removeWorker(state) {
            state.worker.id = null
            state.worker.email = null
            state.token = null
            state.isAuth = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) =>
                    [fetchCreateWorker.pending.type, fetchSignIn.pending.type].includes(action.type),
                (state) => {
                    state.status = 'loading'
                }
            )
            .addMatcher(
                (action) =>
                    [fetchCreateWorker.fulfilled.type, fetchSignIn.fulfilled.type].includes(action.type),
                (state) => {
                    state.status = 'succeeded'
                    state.error = null
                    state.isAuth = true
                }
            )
            .addMatcher(
                (action) => [fetchCreateWorker.rejected.type, fetchSignIn.rejected.type].includes(action.type),
                (state, action:PayloadAction<string> ) => {
                    state.status = 'failed'
                    state.error = action.payload as string
                    state.isAuth = false
                }
            )

    },
});

export const { setWorker, removeWorker, signIn } = workerSlice.actions;

export const workerReducer = workerSlice.reducer;
