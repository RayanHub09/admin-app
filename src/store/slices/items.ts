import {IItem, IReItem} from "../../interfaces";
import {createSlice} from "@reduxjs/toolkit";
import {convertStringToDate, getDate} from "../../functions/changeDate";

interface IState {
    items: IReItem[]
    filteredItems: IReItem[]
    isSearching: boolean
}

const initialState: IState = {
    items: [],
    filteredItems: [],
    isSearching: false
}
const ItemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        getAllItems(state, action) {
            state.items = [...action.payload]
        },
        searchItem(state, action) {
            const [numberOrder, numberDelivery, markName, name, startDate, endDate, status, uid] = action.payload;
            console.log(markName)
            if (numberOrder === '' && numberDelivery === '' && markName === '' && name === '' &&
                startDate === '' && endDate === '' && !Object.values(status).includes(true)) {
                state.isSearching = false
                return
            }
            state.isSearching = true
            state.filteredItems = state.items.filter(item => {
                const itemDate = convertStringToDate(getDate(item.dateOrder)[1]).getTime()
                return (numberOrder === '' || item.numberOrder.includes(numberOrder)) &&
                    (uid === '' || item.uid === uid) &&
                    (numberDelivery === '' || item.numberDelivery.includes(numberDelivery)) &&
                    (markName === '' || item.part.markName.includes(markName)) &&
                    (name === '' || item.part.nameEn.includes(name)) &&
                    (startDate === '' || itemDate >= convertStringToDate(startDate).getTime()) &&
                    (endDate === '' || itemDate <= convertStringToDate(endDate).getTime()) &&
                    (!Object.values(status).includes(true) || status[item.statusOrder]);

            })
        },
        clearSearchItem(state) {
            state.isSearching = false
            state.filteredItems = []
        }
    }
})

export const ItemsReducer = ItemsSlice.reducer

export const {getAllItems, searchItem, clearSearchItem} = ItemsSlice.actions