import {createSlice} from "@reduxjs/toolkit";

interface IState {
    email: string | null,
    token: string | null,
    id: string | null
}

const initialState:IState = {
    email: 'bul@gmail.ru',
    token: 'AMf-vBwumqQdTdcDBgQI7uyQV4raVWxL0bWTyI5Bjls9mivdW4QFWGqafpCC9AG3IVA7NDeqYAstNYlNmJjR2rpVPk0Ae8evp_pGqG-OPD27Jwo3bRNCIlplPxFstQ5bcSXO_xykK8XbbqbPlz1RJ1eULY364Ye-nZATx-nL178IyrVWY3XIS4_Pb_Z5Q_p_w6hebFe8MP9sIIuzU6auWFLl-CGQXJm2Fw',
    id: 'vCwyqytBT4WF3MWgHVdDHn2Xhr62'
}

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
    }
})

export const {
    setWorker,
    removeWorker
} = workerSlice.actions

export const workerReducer = workerSlice.reducer