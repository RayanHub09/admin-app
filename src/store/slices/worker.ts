import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, signInWithEmailAndPassword, UserCredential } from "firebase/auth";

interface IState {
    email: string | null
    token: string | null
    id: string | null
    error: string | null
    status: 'loading' | 'succeeded' | 'failed' | null
    isAuth: boolean
}

const initialState: IState = {
    email: null,
    token: null,
    id: null,
    error: null,
    status: null,
    isAuth: false
};

export const signIn = createAsyncThunk(
    'user/signIn',
    async ({ email, password }: { email: string; password: string }, thunkAPI) => {
        try {
            const userCredential: UserCredential = await signInWithEmailAndPassword(getAuth(), email, password)
            const user = userCredential.user
            const token = await user.getIdToken()
            return { email: user.email, token, id: user.uid }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
);

const workerSlice = createSlice({
    name: 'worker',
    initialState,
    reducers: {
        setWorker(state, action) {
            state.id = action.payload.id
            state.email = action.payload.email
            state.token = action.payload.token
        },
        removeWorker(state) {
            state.id = null
            state.email = null
            state.token = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signIn.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.email = action.payload.email
                state.token = action.payload.token
                state.id = action.payload.id
                state.isAuth = true
            })
            .addCase(signIn.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload as string ?? "Unknown error occurred"
                state.isAuth = false
            });
    },
});

export const { setWorker, removeWorker } = workerSlice.actions;

export const workerReducer = workerSlice.reducer;
