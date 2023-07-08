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

    //カレンダー情報
    const [calendars,setCalendars] = useState<Dayjs[][]>();

    const now:Dayjs= dayjs();
    //対象月初
    const [targetBeginMonth,setTargetBeginMonth] = useState<Dayjs>(now.startOf("month"))
    //開始時刻
    const [startDay,setStartDay] = useState<Dayjs>(targetBeginMonth.subtract(targetBeginMonth.day(),"d"));
    //終了時刻
    const [endDay,setEndDay] = useState<Dayjs>(now.endOf("month").add(6 - now.endOf("month").day() ,"d"));
    //年号
    const [yearNum,setYearNum] = useState<string>("");

    const [calendarsEvent] = useCalendarsEvent(props,
        setPublicHoliday,setCalendars,setTargetBeginMonth,
        setStartDay,setEndDay,setYearNum);


    useLayoutEffect(() => {
        //現在の時刻データを取得する
        //calendarsEvent.getNowDayInfo(startDay,endDay,now);
        Promise.all(([calendarsEvent.getSchedules(startDay,endDay),
            calendarsEvent.getPublicHoliday(now.year()),
            calendarsEvent.getNowDayInfo(startDay,endDay,now)
        ]))
        .then((values:any) => {
             console.info("処理に成功しました");
        })
        .catch((error:any) => {
            console.error(error);
        })
    },[])

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
                    onClick={() => calendarsEvent.getPreAfterDayInfo(targetBeginMonth,1)}></ArrowBackIcon>
                    </Box>
                    
                    <p>{startDay.year()}年</p>
                    <p style={{marginLeft:"10px"}}>{targetBeginMonth.month() + 1}月</p>

                    <Box style={{marginTop:"15px",marginLeft:"20px"}}>
                        <ArrowForwardIcon 
                        onClick={() => calendarsEvent.getPreAfterDayInfo(targetBeginMonth,2)}>
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
