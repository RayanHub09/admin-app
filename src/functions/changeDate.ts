export function getDate(date: string | undefined): [string, string] {
    const [day, month] = date?.split('.') ?? ['', ''];
    return [day, month];
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