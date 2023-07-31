import { Dayjs } from "dayjs";
import { GoogleSchedule } from "../types/googleSchedule";
import { Dispatch, SetStateAction } from "react";
import { ReloadFlag } from "../types/reloadFlag";

type CalendarDetailEvent = {
    openGoogleCalendar: (day:Dayjs) => void;
    summaryClick: (event:any,googleSchedule:GoogleSchedule,day:Dayjs) => void;
    arrowBackIconClick: () => void;
    arrowForwardIconClick:() => void;
}

export const UseCalendarDetailEvent  = (
    setDay:Dispatch<SetStateAction<Dayjs>>,
    setSelectDay:Dispatch<SetStateAction<Dayjs>>,
    setOpenGoogleCalendarFlag:Dispatch<SetStateAction<boolean>>,
    setGoogleSchedule:Dispatch<SetStateAction<GoogleSchedule | null>>,
    setOpenCalendarDetailFlag:Dispatch<SetStateAction<boolean>>,
    setReloadFlag:Dispatch<SetStateAction<ReloadFlag>>,
    getPreAfterDayInfo:(targetBeginMonth:Dayjs,eventType:number) => void,
    targetBeginMonth:Dayjs
): [CalendarDetailEvent] => {
    /**
     * Googleカレンダー追加モーダルを開く
     * @param day 日時情報
     */
    const openGoogleCalendar = (day:Dayjs) => {
        setSelectDay(day);
        setOpenGoogleCalendarFlag(true);
    }
    /**
     * サマリークリック時   
     * @param event イベント
     * @param googleSchedule Googleスケジュール情報 
     * @param day 日時情報
     */
    const summaryClick = (event:any,googleSchedule:GoogleSchedule,day:Dayjs) => {
        //イベントの伝播を中断
        event.stopPropagation();
        setGoogleSchedule(googleSchedule);
        setOpenCalendarDetailFlag(true);
        setDay(day);
    }

    /**
     * 後方矢印クリックイベント
     */
    const arrowBackIconClick = () => {
        getPreAfterDayInfo(targetBeginMonth,1);
        setReloadFlag(2);
    }

    /**
     * 前方矢印クリックイベント
     */
    const arrowForwardIconClick = () => {
        getPreAfterDayInfo(targetBeginMonth,2);
        setReloadFlag(2);
    }


    return [{openGoogleCalendar,summaryClick,arrowBackIconClick,arrowForwardIconClick}];
}

