import {configureStore} from "@reduxjs/toolkit";
import {ManagerReducer} from "./slices/manager";
import {ManagersReducer} from "./slices/managers";
import {OrderReducer} from "./slices/orders";


export const store = configureStore({
    reducer: {
        manager: ManagerReducer,
        managers: ManagersReducer,
        orders: OrderReducer
    }
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']