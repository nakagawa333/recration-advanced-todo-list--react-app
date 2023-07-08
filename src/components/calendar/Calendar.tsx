import React, { Dispatch, SetStateAction, useLayoutEffect, useMemo, useState } from 'react';
import { Box, TableBody, makeStyles } from '@mui/material';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ja';
import '../../index.css';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCalendarsEvent } from '../../hooks/CalendarsEvent';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';


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
            <Box style={{display:"flex"}}>
                <Box>
                <p>{yearNum}</p>
                </Box>

                <Box style={{display:"flex",margin:"auto"}}>
                    <Box style={{marginTop:"15px",marginRight:"20px"}}>
                    <ArrowBackIcon 
                    onClick={() => getPreAfterDayInfo(1)}></ArrowBackIcon>
                    </Box>
                    
                    <p>{startDay.year()}年</p>
                    <p style={{marginLeft:"10px"}}>{targetBeginMonth.month() + 1}月</p>

                    <Box style={{marginTop:"15px",marginLeft:"20px"}}>
                        <ArrowForwardIcon 
                        onClick={() => getPreAfterDayInfo(2)}>
                        </ArrowForwardIcon>
                    </Box>  
                </Box>

                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                 <DateCalendar />
                </LocalizationProvider> */}
            </Box>
        </Box>

        <Box>
            <TableContainer style={{marginBottom:"30px"}}>
                <Table size="medium" style={{border: '1px solid rgba(224, 224, 224, 1)',minHeight:"450px"}}>
                    <TableRow>
                        <TableCell style={{color:"red",borderRight: '1px solid rgba(224, 224, 224, 1)'}} align="center">日</TableCell>
                        <TableCell style={{borderRight: '1px solid rgba(224, 224, 224, 1)'}} align="center">月</TableCell>
                        <TableCell style={{borderRight: '1px solid rgba(224, 224, 224, 1)'}} align="center">火</TableCell>
                        <TableCell style={{borderRight: '1px solid rgba(224, 224, 224, 1)'}} align="center">水</TableCell>
                        <TableCell style={{borderRight: '1px solid rgba(224, 224, 224, 1)'}} align="center">木</TableCell>
                        <TableCell style={{borderRight: '1px solid rgba(224, 224, 224, 1)'}} align="center">金</TableCell>
                        <TableCell style={{color:"aqua",borderRight: '1px solid rgba(224, 224, 224, 1)'}} align="center">土</TableCell>
                    </TableRow>
                    {
                    calendars && calendars.map((arr:any,index:number) => {
                            return(
                                <TableBody key={index}>
                                {
                                    arr.map((value:Dayjs,j:number) => {
                                        return (
                                            <TableCell 
                                            style={{color:calendarsEvent.getColor(value,publicHoliday),
                                                background:calendarsEvent.getBackGroudColor(value,now),
                                                borderRight: '1px solid rgba(224, 224, 224, 1)'
                                            }} 
                                            key={j}
                                            align="center"
                                            >
                                            {value.date()}
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
