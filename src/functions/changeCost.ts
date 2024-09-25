export function changeCost (str:string) {
    const cleanedString = str.replace(/[^\d.]/g, '');
    const number = parseFloat(cleanedString);
    if (isNaN(number)) {
        return 'Некорректная сумма';
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}