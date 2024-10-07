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

export interface IReItem {
    id: string
    dateOrder: string
    numberOrder: string
    numberDelivery: string
    statusOrder: string
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
export interface IReOrder {
    id: string
    numberDelivery: string
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

export interface IManager {
    id: string | null
    email: string | null
    role: string | null
    name: string | null
    [key: string]: string | null | boolean

}

export interface ICustomer {
    address: string
    city: string
    index: string
    name: string
    patronymic: string
    phoneNumber: string
    region: string
    surname: string
}

export interface IPassport {
    number: string
    series: string
}

export interface IRuDelivery {
    damageInsured: boolean
    deliveryFromTC: string
    method: string
    passport: IPassport
    tcInsured: boolean
    terminalName: string
    transportCompany: string
    type: string
}

export interface IDeliveryStatus {
    date: string
    readyToBuy: boolean
    statusName: string
}

export interface IDelivery {
    id: string
    comment: string
    country: string
    creationDate: string
    customer: ICustomer
    deliveryCost: null | number
    deliveryCostYen: null | number
    deliveryMethod: string
    number: string
    orders: IOrder[]
    partsCostRu: number
    partsCostYen: number
    ruDelivery: IRuDelivery | null
    status: IDeliveryStatus
    uid: string
}

export interface IUser {
    id: string
    country: string
    email: string
    name: string
    patronymic: string
    phoneNumber: string
    surname: string
}

export interface IChat {
    id: string
    department: string
    theme: string
    uid: string
    creationDate: string
    messages: IMessage[]
}
export interface IImg {
    name: string
    url: string
}
export interface IMessage {
    id: string
    text: string
    read: boolean
    attachedFiles: IImg[]
    creationTime: string
    uid: string
}