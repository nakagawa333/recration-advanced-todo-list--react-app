import React, { Dispatch, SetStateAction, useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

type CalendarsEvent = {
    getSchedules: (startDay:Dayjs,endDay:Dayjs) => void;
    getPublicHoliday: (year:number) => void;
    getColor: (day:Dayjs,publicHoliday:any) => string;
    getBackGroudColor: (day:Dayjs,now:Dayjs) => string;
    getNowDayInfo:(startDay:Dayjs,endDay:Dayjs,now:Dayjs) => void;
    getPreAfterDayInfo:(targetBeginMonth:Dayjs,eventType:number) => void;
}

export const useCalendarsEvent = (
    props:any,
    setPublicHoliday:Dispatch<SetStateAction<any[]>>,
    setCalendars:Dispatch<SetStateAction<Dayjs[][] | undefined>>,
    setTargetBeginMonth:Dispatch<SetStateAction<Dayjs>>,
    setStartDay:Dispatch<SetStateAction<Dayjs>>,
    setEndDay:Dispatch<SetStateAction<Dayjs>>,
    setYearNum:Dispatch<SetStateAction<string>>
): [CalendarsEvent] => {
    /**
     * スケジュール情報を取得する
     */
    const getSchedules = async(startDay:Dayjs,endDay:Dayjs) => {
        try{
            let axiosRequestConfig:AxiosRequestConfig = {
                params:{
                    timeMin:startDay.toISOString(),
                    timeMax:endDay.toISOString()
                }
            }

            let backendUrl:string | undefined = process.env.REACT_APP_BACKEND_URL;
            if(backendUrl){
                    let res:AxiosResponse = await axios.get(backendUrl + "calendars",axiosRequestConfig);
                    let body = res.data.body;
                    let schedules = body.map((schedule:any) => {
                        return {
                            summary:schedule.summary,
                            description:schedule.description,
                            status:schedule.status,
                            start:dayjs(schedule.start).format("YYYY-MM-DD"),
                            end:dayjs(schedule.end).format("YYYY-MM-DD"),
                            eventType:schedule.eventType
                        }
                    })

                    props.setShedules(schedules);
            }

        } catch(error){
            console.error(error);
            console.error("Googleカレンダー情報の取得に失敗しました");
        }
    }

    /**
     * 前月もしくは次月のデータ情報を取得する
     * @param eventType イベントタイプ 1:前月,2:次月
     */
    const getPreAfterDayInfo = (targetBeginMonth:Dayjs,eventType:number) => {
        let thisTargetBeginMonth = dayjs(targetBeginMonth);
        if(eventType === 1){
            thisTargetBeginMonth = dayjs(thisTargetBeginMonth).subtract(1,"M");
        } else if(eventType === 2){
            thisTargetBeginMonth = dayjs(thisTargetBeginMonth).add(1,"M");
        }
        let thisStartDay = thisTargetBeginMonth.subtract(thisTargetBeginMonth.day(),"d");
        let thisEndDay = thisTargetBeginMonth.endOf("month").add(6 - thisTargetBeginMonth.endOf("month").day() ,"d");

        setTargetBeginMonth(thisTargetBeginMonth);
        setStartDay(thisStartDay);
        setEndDay(thisEndDay);

        let thisCalendars = [];
        let plus:number = 0;
        let isTrue:Boolean = true;
    
        while(isTrue){
            let day;
            let arr:Dayjs[] = [];
            for(let i = 0; i <= 6; i++){
                day = thisStartDay.add(plus,"d");
                arr.push(day);
                plus += 1;
            }
    
            thisCalendars.push(arr);
            if(day && day.month() === thisEndDay.month() && day.day() === thisEndDay.day()
               && day.date() === thisEndDay.date()){
                isTrue = false;
            }
        }

        //カレンダー情報更新
        setCalendars(thisCalendars);
        //年号更新
        setYearNum(thisTargetBeginMonth.toDate().toLocaleString( "ja-JP-u-ca-japanese" ,{ era : "short" }).split("/")[0]);

    }

    /**
     * 現在の時刻データを取得する
     * @param startDay 表示開示日時
     * @param endDay 表示終了日時
     * @param now 現在時刻
     */
    const getNowDayInfo = (startDay:Dayjs,endDay:Dayjs,now:Dayjs) => {
        let thisCalendars = [];
        let plus:number = 0;
        let isTrue:Boolean = true;
    
        while(isTrue){
            let day;
            let arr:Dayjs[] = [];
            for(let i = 0; i <= 6; i++){
                day = startDay.add(plus,"d");
                arr.push(day);
                plus += 1;
            }
    
            thisCalendars.push(arr);
            if(day && day.month() === endDay.month() && day.day() === endDay.day()){
                isTrue = false;
            }
        }

        //カレンダー情報更新
        setCalendars(thisCalendars);
        //年号更新
        setYearNum(now.toDate().toLocaleString( "ja-JP-u-ca-japanese" ,{ era : "short" }).split("/")[0]);        
    }

    /**
     * 対象年に対する祝日の情報を取得する
     * @param year 年
     */
    const getPublicHoliday = async(year:number) => {
        try{
            let axiosRequestConfig:AxiosRequestConfig = {
                params:{
                    year:year
                }                
            }

            let backendUrl:string | undefined = process.env.REACT_APP_BACKEND_URL;
            if(backendUrl){
                let res:AxiosResponse = await axios.get(backendUrl + "getNationalHolidays",axiosRequestConfig);
                let body = res.data.body;
                setPublicHoliday(body);
            }
        } catch(error){
            console.error(error);
            console.error("祝日の取得に失敗しました")
        }
    }

    /**
     * 色を取得する
     * @param dayjs 
     * @returns 色
     */
    const getColor = (dayjs:Dayjs,publicHoliday:any) => {
        //土曜日
        if(dayjs.day() === 6){
            return "aqua";
        }

        //日曜日
        if(dayjs.day() === 0){
            return "red";
        }

        //祝日
        if(publicHoliday[dayjs.format("YYYY-MM-DD")]){
            console.log("hello")
            return "red";
        }

        //それ以外
        return "black";
    }

    /**
     * 背景色を取得する
     * @param dayjs 
     * @param now 
     * @returns 
     */
    const getBackGroudColor = (dayjs:Dayjs,now:Dayjs) => {
        if(dayjs.format("YYYY-MM-DD") === now.format("YYYY-MM-DD")) {
            return "blue";
        }
        return "white";
    }

    return [{ getSchedules, getPublicHoliday,getColor,getBackGroudColor,getNowDayInfo,getPreAfterDayInfo}];
};