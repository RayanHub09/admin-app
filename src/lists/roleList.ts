export interface IRole {
    spare_parts : string,
    yahoo_auctions: string,
    parcels : string,
    accounting : string
}

export const options: IRole = {
    spare_parts: 'Запчасти',
    yahoo_auctions: 'Yahoo аукционы',
    parcels: 'Посылки',
    accounting: 'Бухгалтерия'
}