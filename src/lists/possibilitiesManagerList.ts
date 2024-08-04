export interface IPossibilitiesManager {
    changeOrderNumber: string
    writeComments: string
    cancelDelivery: string
    changeStatusDelivery: string
}

export const possibilitiesManager:IPossibilitiesManager = {
    cancelDelivery: 'отмена посылок',
    writeComments: 'добавление комментариев',
    changeOrderNumber: 'изменение номера заказа',
    changeStatusDelivery: 'изменение статуса заказа',
}