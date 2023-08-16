import dayjs, { Dayjs } from "dayjs";

export class Day{
    /**
     * 終了時刻が開始時刻よりも後であるかを判定する
     * @param startTime 開始時刻
     * @param endTime 終了時刻
     * @returns 
     */
    public static compareStartToEndTime(startTime:string,endTime:string){
        return dayjs(startTime).isBefore(dayjs(endTime));
    }

    /**
     * 日時情報(月日)を取得する
     * @param day 
     * @returns 日時情報(月日)
     */
    public static getDayInfo(day:Dayjs){
        if(day){
            return day?.month() + 1 + "月" + day?.date() + "日";
        }
        return "";
    }
}