import React, { Dispatch, SetStateAction, useLayoutEffect, useMemo, useState } from 'react';
import { TableBody } from '@mui/material';
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

    //現在時刻
    const now:Dayjs = dayjs();
    const startDay:Dayjs = now.startOf("month").subtract(now.startOf("month").day(),"d");
    const endDay:Dayjs = now.endOf("month").add(6 - now.endOf("month").day() ,"d");
    //祝日
    const [publicHoliday,setPublicHoliday] = useState<any>([]);

    const [calendarsEvent] = useCalendarsEvent(props,setPublicHoliday);
    //日本の時刻に変換
    dayjs.locale('ja');

    let calendars:Dayjs[][] = [];
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

        calendars.push(arr);
        if(day && day.month() === endDay.month() && day.day() === endDay.day()){
            isTrue = false;
        }
    }

    const options = {era: 'long'};
    //年号
    let yearNum:string = now.toDate().toLocaleString( "ja-JP-u-ca-japanese" ,{ era : "short" }).split("/")[0] + "年";

    useLayoutEffect(() => {
        Promise.all(([calendarsEvent.getSchedules(startDay,endDay),
            calendarsEvent.getPublicHoliday(now)]))
        .then((values:any) => {
            console.info("処理に成功しました");
        })
        .catch((error:any) => {
            console.error(error);
        })
    },[])

    return(
        <>
        <div style={{display:"flex"}}>
            <div>
              <p>{yearNum}</p>
            </div>

            <div style={{display:"flex",margin:"auto"}}>
                <p>{startDay.year()}年</p>
                <p style={{marginLeft:"10px"}}>{now.month() + 1}月</p>                
            </div>
        </div>
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
                  calendars.map((arr:any,index:number) => {
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
        </>
    )
}

export default Calendar
