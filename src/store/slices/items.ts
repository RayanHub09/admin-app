    import {IItem, IReItem} from "../../interfaces";
    import {createSlice} from "@reduxjs/toolkit";
    import {convertStringToDate, getDate} from "../../functions/changeDate";

    interface IState {
        items: IReItem[]
        sortedItems: IReItem[]
        filteredItems: IReItem[]
        filteredSortedItems: IReItem[]
        isSearching: boolean
        isSorting: boolean
        paramSort: boolean | null
    }

    const initialState: IState = {
        sortedItems: [],
        items: [],
        filteredItems: [],
        filteredSortedItems: [],
        isSearching: false,
        isSorting: false,
        paramSort: null
    }
    const ItemsSlice = createSlice({
        name: 'items',
        initialState,
        reducers: {
            getAllItems(state, action) {
                state.items = [...action.payload]
                console.log(state.items)
            },
            searchItem(state, action) {
                const [numberOrder, numberDelivery, markName, id, startDate, endDate, status, uid] = action.payload;
                if (numberOrder === '' && numberDelivery === '' && markName === '' && id === '' &&
                    startDate === '' && endDate === '' && !Object.values(status).includes(true)) {
                    state.isSearching = false
                    return
                }
                state.isSearching = true
                state.filteredItems = state.items.filter(item => {
                    const itemDate = item.dateOrder
                    return (numberOrder === '' || item.numberOrder.includes(numberOrder)) &&
                        (uid === '' || item.uid === uid) &&
                        (numberDelivery === '' || item.numberDelivery.includes(numberDelivery)) &&
                        (markName === '' || item.part.markName.includes(markName)) &&
                        (id === '' || item.id.includes(id)) &&
                        (startDate === '' || itemDate >= startDate) &&
                        (endDate === '' || itemDate <= endDate) &&
                        (!Object.values(status).includes(true) || status[item.statusOrder]);
            })
                if (state.isSorting) {
                    state.filteredSortedItems = [...state.filteredItems].sort((a, b) => {
                        const dateA = +a.dateOrder
                        const dateB = +b.dateOrder
                        return action.payload ? dateA - dateB : dateB - dateA
                    })
                }
            },
            clearSearchItem(state) {
                state.isSearching = false
                state.filteredItems = []
            },
            pushNewItems(state, action) {
                const [items, order_number, order_id] = [...action.payload]
                const new_items = items.map((item: IItem)  => ({...item, idOrder: order_id, numberOrder: order_number} as IReItem))
                state.items = [...state.items, new_items]
            },
            sortItems(state, action) {
                state.isSorting = true
                state.sortedItems = [...state.items]
                state.paramSort = action.payload
                state.sortedItems.sort((a, b) => {
                    const dateA = +a.dateOrder
                    const dateB = +b.dateOrder
                    return action.payload ? dateA - dateB : dateB - dateA
                })
                state.filteredSortedItems = [...state.filteredItems]
                state.filteredSortedItems.sort((a, b) => {
                    const dateA = +a.dateOrder
                    const dateB = +b.dateOrder
                    return action.payload ? dateA - dateB : dateB - dateA
                })
            },
            resetSort(state) {
                state.isSorting = false
                state.paramSort = null
            }

        }
    })

    export const ItemsReducer = ItemsSlice.reducer

    export const {getAllItems, searchItem, clearSearchItem, pushNewItems,
        sortItems, resetSort
    } = ItemsSlice.actions