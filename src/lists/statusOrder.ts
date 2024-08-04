export const statusOrder:string[] = ['Не оплачен', 'В обработке', 'Обработка в Японии',
    'На складе в Японии', 'Ожидает упаковки', 'Упакован', 'Ожидает отправки из Японии',
    'Отправлен из Японии', 'Доставлен во Владивосток', 'Отправлен по России',
    'Доставлен получателю', 'Ожидает подтверждения', 'Отменен', 'Утилизирован']

export function getNewStatus(oldStatus:string):number {
    return statusOrder.findIndex(status => status === oldStatus) + 1
}