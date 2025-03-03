// export function getDate(date: string | undefined): [string, string] {
//     if (typeof date !== 'string') {
//         console.error('Expected a string but received:', date);
//         return ['', ''];
//     }
//     console.log(date)
//     const [day, month] = date?.split('.') ?? ['', ''];
//     return [day, month];
// }
import {Timestamp} from "firebase/firestore";
import firebase from "firebase/compat";

export function getDate(seconds:any): [string, string] {
    let date:Date
    if (seconds instanceof Timestamp) {
        date = new Date(+seconds.seconds * 1000);
    } else {
        date = new Date(+seconds * 1000);
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const secondsFormatted = String(date.getSeconds()).padStart(2, '0')
    return [`${day}.${month}.${year}`, `${hours}:${minutes}:${secondsFormatted}`];
}

export function convertStringToDate(dateString: string): Date {
    let parts = dateString.split('.');
    if (parts.length === 3) {
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }

    parts = dateString.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }

    parts = dateString.split('-');
    if (parts.length === 3) {
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }

    return new Date('Invalid Date');
}


export function convertToString(isoString:string) {
    const date = new Date(isoString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}