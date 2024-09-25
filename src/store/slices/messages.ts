import {IMessage} from "../../interfaces";
import {createSlice} from "@reduxjs/toolkit";

interface IState {
    messages: IMessage[]
    error: string | null
    status: 'loading' | 'succeeded' | 'failed' | null
    statusGet: 'loading' | 'succeeded' | 'failed' | null
}

const initialState:IState = {
    messages: [],
    error: null,
    status: null,
    statusGet: null
}

const MessagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {

    }
})

export const MessageReducer = MessagesSlice.reducer