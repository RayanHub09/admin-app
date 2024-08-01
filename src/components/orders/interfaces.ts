export interface IPart {
    discontinued: boolean
    discontinuedTitleEn: string
    discontinuedTitleRu: string
    markName: string
    name: string
    nameEn: string
    nameRu: string
    notOriginalReplacements: string[]
    oldPartNumbers: string[]
    partNo: string
    priceEur: number
    priceRub: number
    priceUsd: number
    priceYen: number
    sameTimeReplacements: string[]
    weight: number
}

export interface IItem {
    id: string
    amount: number
    comment: string
    part: IPart
    selected: boolean
}

export interface IStatus {
    archived: false
    date: string
    readyToPackage: boolean
    statusName: string
}

export interface IOrder {
    id: string
    comment: string
    date: string
    items: IItem[]
    itemsCnt: number
    number: string
    priceRu: number
    priceYen: number
    status: IStatus
    uid: string
}