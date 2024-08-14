import {IItem} from "../../interfaces";
import {createSlice} from "@reduxjs/toolkit";

interface IState {
    items : IItem[]
    filteredItems: IItem[]
    isSearching: boolean
}

const initialState:IState = {
    items: [],
    filteredItems: [],
    isSearching: false
}
const ItemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        getAllItems(state, action) {
            console.log(0)
            state.items = [...action.payload]
        }
    }
})

export const ItemsReducer = ItemsSlice.reducer

export const {getAllItems} = ItemsSlice.actions