import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createUserWithEmailAndPassword, getAuth, UserCredential} from "firebase/auth";
import {addDoc, collection, db, doc, getDocs, query, setDoc, updateDoc} from "../../firebase";
import {IManager, IOrder} from "../../interfaces";

interface IAuthManager {
    email: string | null
    role: string | null
    name: string | null
    [key: string]: string | null | boolean
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
    async ({email, password, role, name, checkboxes}:
               { email: string; password: string; role: string, name: string,
                   checkboxes: { [key: string]: boolean | null }}, thunkAPI) => {
        try {
            const userCredential: UserCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
            const newManager: IAuthManager = {
                email,
                role,
                name,
                ...checkboxes
            }
            await setDoc(doc(collection(db, "managers"), userCredential.user.uid), newManager)
            thunkAPI.dispatch(addWorker({...newManager, id: userCredential.user.uid} ));

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
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as IManager))
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }

    }
)

export const fetchChangePossibilitiesManager = createAsyncThunk(
    'managers/fetchChangePossibilitiesManager',
    async ({managerId, checkboxes} : {managerId: string, checkboxes: { [key: string]: boolean | null }}, thunkAPI) => {
        const managerDocRef = doc(db, 'managers', managerId)
        try {
            await updateDoc(managerDocRef, checkboxes)
            thunkAPI.dispatch(changePossibilitiesManager({managerId, checkboxes}))
        } catch (error:any) {
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
        },
        changePossibilitiesManager(state, action) {
            const { managerId, checkboxes } = action.payload
            state.managers = state.managers.map(manager =>
                manager.id === managerId ? { ...manager, ...checkboxes } : manager
            ) as IManager[]
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
                    [fetchSignUpManager.pending.type, fetchChangePossibilitiesManager.pending.type].includes(action.type),
                (state) => {
                    state.status = 'loading'
                }
            )
            .addMatcher(
                (action) =>
                    [fetchSignUpManager.fulfilled.type, fetchGetAllManagers.fulfilled.type, fetchChangePossibilitiesManager.fulfilled.type
                    ].includes(action.type),
                (state) => {
                    state.status = 'succeeded'
                    state.error = null
                }
            )
            .addMatcher(
                (action) =>
                    [fetchSignUpManager.rejected.type, fetchGetAllManagers.rejected.type, fetchChangePossibilitiesManager.rejected.type
                    ].includes(action.type),
                (state, action: PayloadAction<string>) => {
                    state.status = 'failed'
                    state.error = action.payload as string
                }
            )
    }
})

export const ManagersReducer = ManagersSlice.reducer
export const {addWorker, getAllManagers, setError, changePossibilitiesManager} = ManagersSlice.actions