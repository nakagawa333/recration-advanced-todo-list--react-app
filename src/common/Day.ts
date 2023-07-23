import dayjs from "dayjs";

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
}