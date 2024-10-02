import {configureStore} from "@reduxjs/toolkit";
import {ManagerReducer} from "./slices/manager";
import {ManagersReducer} from "./slices/managers";
import {OrderReducer} from "./slices/orders";
import {DeliveriesReducer} from "./slices/deliveries";
import {ItemsReducer} from "./slices/items";
import {ChatReducer} from "./slices/messages";
import {UserReducer} from "./slices/users";


export const store = configureStore({
    reducer: {
        manager: ManagerReducer,
        managers: ManagersReducer,
        orders: OrderReducer,
        deliveries: DeliveriesReducer,
        items: ItemsReducer,
        messages: ChatReducer,
        users: UserReducer
    }
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']