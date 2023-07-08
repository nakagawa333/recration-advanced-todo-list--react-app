import React, { Dispatch, SetStateAction, useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

type CalendarsEvent = {
    getSchedules: (startDay:Dayjs,endDay:Dayjs) => void;
    getPublicHoliday: (year:number) => void;
    getColor: (day:Dayjs,publicHoliday:any) => string;
    getBackGroudColor: (day:Dayjs,now:Dayjs) => string;
}

export const useCalendarsEvent = (
    props:any,
    setPublicHoliday:Dispatch<SetStateAction<any[]>>
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

    return [{ getSchedules, getPublicHoliday,getColor,getBackGroudColor}];
};