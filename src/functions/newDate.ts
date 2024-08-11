export function getDate(str: string): string[] {
    const date = str?.split('T')[0]
    const time = str?.split('T')[1].toString().slice(0, -5)
    return [time, date.split('-').reverse().join('.')]
}