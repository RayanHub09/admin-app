import {configureStore} from "@reduxjs/toolkit";
import {workerReducer} from "./slices/worker";


export const store = configureStore({
    reducer: {
        worker: workerReducer
    }
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']