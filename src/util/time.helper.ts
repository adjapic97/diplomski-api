
export class TimeHelper {
    static getCurrentDate(): Date {
        return new Date();
    }

    static getCurrentTime(): string {
        const date = new Date();
        return addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds());
    }

}

function addZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
}