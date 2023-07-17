import React, { Dispatch, SetStateAction, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Box, TableBody, Typography, makeStyles } from '@mui/material';
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
import { GoogleSchedule } from '../../types/googleSchedule';
import { DateFormat } from '../../constants/Date';
import CircularIndeterminate from '../circular/CircularIndeterminate';
import CalendarDetail from './CalendarDetail';
import { EventColors } from '../../types/eventColors';


type Props = {
    googleSchedules:any[]//Googleカレンダー スケジュール情報
    setGoogleShedules:Dispatch<SetStateAction<any[]>>
    setHoliday:Dispatch<SetStateAction<any[]>>
}

function Calendar(props:Props){
    //日本の時刻に変換
    dayjs.locale('ja');
    //祝日
    const [publicHoliday,setPublicHoliday] = useState<any>([]);

    //カレンダー情報
    const [calendars,setCalendars] = useState<Dayjs[][]>();

    const [googleSchedulesMap,setGoogleSchedulesMap] = useState<Map<string, GoogleSchedule[]>>();

    const now:Dayjs= dayjs();
    //対象月初
    const [targetBeginMonth,setTargetBeginMonth] = useState<Dayjs>(now.startOf("month"))
    //開始時刻
    const [startDay,setStartDay] = useState<Dayjs>(targetBeginMonth.subtract(targetBeginMonth.day(),"d"));
    //終了時刻
    const [endDay,setEndDay] = useState<Dayjs>(now.endOf("month").add(6 - now.endOf("month").day() ,"d"));
    //年号
    const [yearNum,setYearNum] = useState<string>("");
    const [eventColors,setEventColors] = useState<EventColors>({});

    const [showCircularFlag,setShowCircularFlag] = useState<boolean>(false);
    const [detailModalFlag,setDetailModalFlag] = useState<boolean>(false);

    const [calendarsEvent] = useCalendarsEvent(props,
        setPublicHoliday,setCalendars,setTargetBeginMonth,
        setStartDay,setEndDay,setYearNum,setGoogleSchedulesMap,
        setShowCircularFlag,setEventColors);
    
    const [reloadFlag,setReloadFlag] = useState<number>(0);

    useLayoutEffect(() => {
        if(reloadFlag === 0 || reloadFlag === 2){
            setShowCircularFlag(true);
            Promise.all(([calendarsEvent.getSchedules(startDay,endDay),
                calendarsEvent.getPublicHoliday(now.year()),
                calendarsEvent.getNowDayInfo(startDay,endDay,now)  //現在の時刻データを取得する
            ]))
            .then((values:any) => {
                 console.info("処理に成功しました");
            })
            .catch((error:any) => {
                console.error(error);
            })
            .finally(() => {
                setShowCircularFlag(false);
                setReloadFlag(1);
            })
        }
    },[reloadFlag])

    return(
        <>

        <CircularIndeterminate
        showFlag={showCircularFlag}
        />

        <CalendarDetail
          yearNum={yearNum}
          targetBeginMonth={targetBeginMonth}
          startDay={startDay}
          endDay={endDay}
          calendars={calendars}
          now={now}
          eventColors={eventColors}
          publicHoliday={publicHoliday}
          googleSchedulesMap={googleSchedulesMap}
          setDetailModalFlag={setDetailModalFlag}
          setReloadFlag={setReloadFlag}
          getPreAfterDayInfo={calendarsEvent.getPreAfterDayInfo}
          getColor={calendarsEvent.getColor}
          getBackGroudColor={calendarsEvent.getBackGroudColor}
          getNowDayInfo={calendarsEvent.getNowDayInfo}
        />

        </>
    )
}

export default Calendar
