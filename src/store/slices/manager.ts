import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import { getAuth, signInWithEmailAndPassword, UserCredential, createUserWithEmailAndPassword } from "firebase/auth";
import { db, collection, query, where, getDocs } from "../../firebase";


interface IManager {
    id: string | null
    email: string | null
    role: string | null
}

interface IState {
    manager: IManager
    error: string | null
    status: 'loading' | 'succeeded' | 'failed' | null
    isAuth: boolean
    token: string | null
}

const initialState: IState = {
    manager: {
        id: null,
        email: null,
        role: null
    },
    error: null,
    status: null,
    token: null,
    isAuth: false
}



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
            const q = query(collection(db, "managers"));
            const querySnapshot = await getDocs(q);
            const userData: IManager[] = querySnapshot.docs.map((doc) => {
                const data = doc.data() as IManager;
                return {
                    id: doc.id,
                    email: data.email,
                    role: data.role
                };
            });
            const Manager = userData.filter((item, index) => item.email === email)
            thunkAPI.dispatch(setManager(Manager[0]))

        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
);


const ManagerSlice = createSlice({
    name: 'Manager',
    initialState,
    reducers: {
        signIn(state, action) {
            state.manager.id = action.payload.id
            state.manager.email = action.payload.email
            state.token = action.payload.token
        },
        setManager(state, action) {
            state.manager.id = action.payload.id
            state.manager.email = action.payload.email
            state.manager.role = action.payload.role
        },
        removeManager(state) {
            state.manager.id = null
            state.manager.email = null
            state.token = null
            state.status = null
            state.isAuth = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) =>
                    [fetchSignIn.pending.type].includes(action.type),
                (state) => {
                    state.status = 'loading'
                }
            )
            .addMatcher(
                (action) =>
                    [fetchSignIn.fulfilled.type].includes(action.type),
                (state) => {
                    state.status = 'succeeded'
                    state.error = null
                    state.isAuth = true
                }
            )
            .addMatcher(
                (action) =>
                    [ fetchSignIn.rejected.type].includes(action.type),
                (state, action:PayloadAction<string> ) => {
                    state.status = 'failed'
                    state.error = action.payload as string
                    state.isAuth = false
                }
            )

    },
});

export const { setManager, removeManager, signIn } = ManagerSlice.actions;

export const ManagerReducer = ManagerSlice.reducer;
