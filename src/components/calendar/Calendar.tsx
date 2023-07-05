import React, { Dispatch, SetStateAction, useLayoutEffect, useMemo, useState } from 'react';
import { Box, TableBody } from '@mui/material';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ja';
import '../../index.css';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Set } from 'typescript';
import { useCalendarsEvent } from '../../hooks/CalendarsEvent';

type Props = {
    schedules:any[]
    setShedules:Dispatch<SetStateAction<any[]>>
    setHoliday:Dispatch<SetStateAction<any[]>>
}

function Calendar(props:Props){
    //日本の時刻に変換
    dayjs.locale('ja');
    //祝日
    const [publicHoliday,setPublicHoliday] = useState<any>([]);

    const [calendarsEvent] = useCalendarsEvent(props,setPublicHoliday);

    //カレンダー情報
    const [calendars,setCalendars] = useState<Dayjs[][]>();

    const [now,setNow] = useState<Dayjs>(dayjs());
    //対象月初
    const [targetBeginMonth,setTargetBeginMonth] = useState<Dayjs>(now.startOf("month"))
    //開始時刻
    const [startDay,setStartDay] = useState<Dayjs>(targetBeginMonth.subtract(targetBeginMonth.day(),"d"));
    //終了時刻
    const [endDay,setEndDay] = useState<Dayjs>(now.endOf("month").add(6 - now.endOf("month").day() ,"d"));
    //年号
    const [yearNum,setYearNum] = useState<string>("");

    useLayoutEffect(() => {
        //現在の時刻データを取得する
        getNowDayInfo();
        Promise.all(([calendarsEvent.getSchedules(startDay,endDay),
            calendarsEvent.getPublicHoliday(now)]))
        .then((values:any) => {
            console.info("処理に成功しました");
        })
        .catch((error:any) => {
            console.error(error);
        })
    },[])

    /**
     * 前月もしくは次月のデータ情報を取得する
     * @param eventType イベントタイプ 1:前月,2:次月
     */
    const getPreAfterDayInfo = (eventType:number) => {
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
     */
    const getNowDayInfo = () => {
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

    return(
        <>
        <Box>
            <div style={{display:"flex"}}>
                <div>
                <p>{yearNum}</p>
                </div>

                <p onClick={() => getPreAfterDayInfo(1)}>前</p>
                <div style={{display:"flex",margin:"auto"}}>
                    <p>{startDay.year()}年</p>
                    <p style={{marginLeft:"10px"}}>{targetBeginMonth.month() + 1}月</p>                
                </div>

                <p onClick={() => getPreAfterDayInfo(2)}>次</p>
            </div>
        </Box>

        <Box>
            <TableContainer style={{marginBottom:"30px"}}>
                <Table>
                    <TableRow>
                        <TableCell style={{color:"red"}}>日</TableCell>
                        <TableCell>月</TableCell>
                        <TableCell>火</TableCell>
                        <TableCell>水</TableCell>
                        <TableCell>木</TableCell>
                        <TableCell>金</TableCell>
                        <TableCell style={{color:"aqua"}}>土</TableCell>
                    </TableRow>
                    {
                    calendars && calendars.map((arr:any,index:number) => {
                            return(
                                <TableBody key={index}>
                                {
                                    arr.map((value:Dayjs,j:number) => {
                                        return (
                                            <TableCell 
                                            style={{color:calendarsEvent.getColor(value,publicHoliday),background:calendarsEvent.getBackGroudColor(value,now)}} 
                                            key={j}>{value.date()}
                                            </TableCell>
                                        )
                                    })
                                }
                                </TableBody>
                            )
                        })
                    }
                </Table>
            </TableContainer>
        </Box>
        </>
    )
}

export default Calendar
