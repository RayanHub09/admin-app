import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import { getAuth, signInWithEmailAndPassword, UserCredential, signInWithCustomToken } from "firebase/auth";
import { db, collection, query, where, getDocs } from "../../firebase";
import {IManager} from "../../interfaces";

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
        role: null,
        name: null,
        changeOrderNumber: null,
        changeDeliveryNumber: null,
        writeCommentsOrder: null,
        writeCommentsDelivery: null,
        cancelOrder: null,
        cancelDelivery: null,
        changeStatusDelivery: null,
        changeStatusOrders: null,
        calculateDeliveryCost: null
    },
    error: null,
    status: null,
    isAuth: !!localStorage.getItem('token'),
    token: localStorage.getItem('token')
}


export const fetchSignIn = createAsyncThunk(
    'user/signIn',
    async ({ email, password }: { email: string; password: string }, thunkAPI) => {
        try {
            const userCredential: UserCredential = await signInWithEmailAndPassword(getAuth(), email, password);
            const user = userCredential.user;
            const token = await user.getIdToken();
            thunkAPI.dispatch(signIn({
                id: user.uid,
                token,
                email: user.email
            }));
            const q = query(collection(db, "managers"));
            const querySnapshot = await getDocs(q);
            const userData: IManager[] = querySnapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                } as IManager;
            });

            const Manager = userData.find((item) => item.email === email);
            if (!Manager) {
                throw new Error('Manager not found');
            }
            thunkAPI.dispatch(setManager(Manager));
            localStorage.setItem('token', token);
            localStorage.setItem('email', email);
        } catch (error: any) {
            // thunkAPI.dispatch(removeManager())
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const fetchAutoSignIn = createAsyncThunk(
    'user/autoSignIn',
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }
            const user = getAuth();
            const q = query(collection(db, "managers"));
            const querySnapshot = await getDocs(q);
            const userData: IManager[] = querySnapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                } as IManager;
            });

            const Manager = userData.find((item) => item.email === localStorage.getItem('email'));
            if (!Manager) {
                throw new Error('Manager not found');
            }
            thunkAPI.dispatch(setManager(Manager));
        } catch (error: any) {
            console.log('=====', error);
            return thunkAPI.rejectWithValue(error.message);
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
            state.isAuth = true
        },
        setManager(state, action) {
            state.manager = action.payload
        },
        removeManager(state) {
            state.manager.id = null
            state.manager.email = null
            state.token = null
            state.status = null
            state.isAuth = false
            localStorage.removeItem('token')
        },
        resetError(state) {
            state.error = null
            state.isAuth = true
            state.status = 'succeeded'
            // state.token = st
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) =>
                    [fetchSignIn.pending.type, fetchAutoSignIn.pending.type].includes(action.type),
                (state) => {
                    state.status = 'loading'
                    console.log(state.status)
                }
            )
            .addMatcher(
                (action) =>
                    [fetchSignIn.fulfilled.type, fetchAutoSignIn.fulfilled.type].includes(action.type),
                (state) => {
                    state.status = 'succeeded'
                    console.log(state.status)
                    state.error = null
                    state.isAuth = true

                }
            )
            .addMatcher(
                (action) =>
                    [ fetchSignIn.rejected.type, fetchAutoSignIn.rejected.type].includes(action.type),
                (state, action:PayloadAction<string> ) => {
                    state.status = 'failed'
                    state.error = action.payload as string
                    state.isAuth = false
                    console.log(state.status)
                }
            )

    },
});

export const { setManager, removeManager, signIn, resetError } = ManagerSlice.actions;

export const ManagerReducer = ManagerSlice.reducer;
