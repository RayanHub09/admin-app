export interface IPossibilitiesManager {
    changeOrderNumber: string
    changeDeliveryNumber: string
    writeCommentsOrder: string
    writeCommentsDelivery: string
    cancelOrder: string
    cancelDelivery: string
    changeStatusDelivery: string
    changeStatusOrders: string
    calculateDeliveryCost: string
    changeWeight: string
    chatManagement: string
}

export const possibilitiesManager:IPossibilitiesManager = {
    cancelOrder: 'отмена заказа',
    cancelDelivery: 'отмена доставки',
    writeCommentsOrder: 'добавление комментариев к заказу',
    writeCommentsDelivery: 'добавление комментариев к доставке',
    changeOrderNumber: 'изменение номера заказа',
    changeDeliveryNumber: 'изменение номера доставки',
    changeStatusDelivery: 'изменение статуса доставки',
    changeStatusOrders: 'изменение статуса заказа',
    calculateDeliveryCost: 'расчет стоимости доставки',
    changeWeight: 'изменение веса',
    chatManagement: 'управление чатами'

}