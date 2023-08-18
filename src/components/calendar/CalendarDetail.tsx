import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Chip, TableBody, Typography} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { DateFormat } from '../../constants/Date';
import { GoogleSchedule } from '../../types/googleSchedule';
import { Dispatch, SetStateAction, useState } from 'react';
import GoogleSchedulesDetailModal from '../modal/GoogleSchedulesDetailModal';
import { EventColors } from '../../types/eventColors';
import GoogleSchedulesAddModal from '../modal/GoogleSchedulesAddModal';
import { UseCalendarDetailEvent } from '../../hooks/UseCalendarDetailEvent';
import { ReloadFlag } from '../../types/reloadFlag';

type Props = {
    yearNum:string //年号
    targetBeginMonth:Dayjs
    startDay:Dayjs
    endDay:Dayjs
    calendars:Dayjs[][] | undefined
    now:Dayjs
    eventColors:EventColors
    publicHoliday:any
    googleSchedulesMap:Map<string, GoogleSchedule[]> | undefined
    setDetailModalFlag:Dispatch<SetStateAction<boolean>>
    setReloadFlag:Dispatch<SetStateAction<ReloadFlag>>
    getPreAfterDayInfo:(targetBeginMonth:Dayjs,eventType:number) => void;
    getColor: (day:Dayjs,publicHoliday:any) => string;
    getBackGroudColor: (day:Dayjs,now:Dayjs) => string;
    getNowDayInfo:(startDay:Dayjs,endDay:Dayjs,now:Dayjs) => void;
}


//カレンダー詳細
function CalendarDetail(props:Props){
    //詳細モーダル 表示フラグ
    const [openCalendarDetailFlag,setOpenCalendarDetailFlag] = useState<boolean>(false);
    //Googleカレンダー新規作成フラグ
    const [openGoogleCalendarFlag,setOpenGoogleCalendarFlag] = useState<boolean>(false);
    const [googleSchedule,setGoogleSchedule] = useState<GoogleSchedule | null>(null);
    const [day,setDay] = useState<Dayjs>(dayjs());

    const [selectDay,setSelectDay] = useState<Dayjs>(dayjs());

    const [event] = UseCalendarDetailEvent(
        setDay,
        setSelectDay,
        setOpenGoogleCalendarFlag,
        setGoogleSchedule,
        setOpenCalendarDetailFlag,
        props.setReloadFlag,
        props.getPreAfterDayInfo,
        props.targetBeginMonth
    );

    return(
        <>
            <GoogleSchedulesDetailModal 
              openFlag={openCalendarDetailFlag}
              setOpenFlag={setOpenCalendarDetailFlag}
              setReloadFlag={props.setReloadFlag}
              googleSchedule={googleSchedule}
              day={day}
              eventColors={props.eventColors}
            />

            <GoogleSchedulesAddModal
              openFlag={openGoogleCalendarFlag}
              setOpenFlag={setOpenGoogleCalendarFlag}
              setReloadFlag={props.setReloadFlag}
              day={selectDay}
              eventColors={props.eventColors}
            />
            <Box>
                <Box style={{display:"flex"}}>
                    <Box>
                    <p>{props.yearNum}</p>
                    </Box>

                    <Box style={{display:"flex",margin:"auto"}}>
                        <Box style={{marginTop:"15px",marginRight:"20px"}}>
                        <ArrowBackIcon 
                        onClick={() => event.arrowBackIconClick()}></ArrowBackIcon>
                        </Box>
                        
                        <p>{props.startDay.year()}年</p>
                        <p style={{marginLeft:"10px"}}>{props.targetBeginMonth.month() + 1}月</p>

                        <Box style={{marginTop:"15px",marginLeft:"20px"}}>
                            <ArrowForwardIcon 
                            onClick={() => event.arrowForwardIconClick()}>
                            </ArrowForwardIcon>
                        </Box>  
                    </Box>
                </Box>
            </Box>

            <Box>
                <TableContainer style={{marginBottom:"30px"}}>
                    <Table size="medium" style={{border: '1px solid rgba(224, 224, 224, 1)',
                        minHeight:"450px",tableLayout: "fixed"}}>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{color:"red",borderRight: '1px solid rgba(224, 224, 224, 1)'}} align="center">日</TableCell>
                                <TableCell style={{borderRight: '1px solid rgba(224, 224, 224, 1)'}} align="center">月</TableCell>
                                <TableCell style={{borderRight: '1px solid rgba(224, 224, 224, 1)'}} align="center">火</TableCell>
                                <TableCell style={{borderRight: '1px solid rgba(224, 224, 224, 1)'}} align="center">水</TableCell>
                                <TableCell style={{borderRight: '1px solid rgba(224, 224, 224, 1)'}} align="center">木</TableCell>
                                <TableCell style={{borderRight: '1px solid rgba(224, 224, 224, 1)'}} align="center">金</TableCell>
                                <TableCell style={{color:"aqua",borderRight: '1px solid rgba(224, 224, 224, 1)'}} align="center">土</TableCell>
                            </TableRow>
                        </TableHead>
                        {
                        props.calendars && props.calendars.map((dayArr:Dayjs[],index:number) => {
                                return(
                                    <TableBody key={index}>
                                    {
                                        dayArr.map((day:Dayjs,j:number) => {
                                            return (
                                                <TableCell 
                                                    style={{color:props.getColor(day,props.publicHoliday),
                                                        background:props.getBackGroudColor(day,props.now),
                                                        borderRight: '1px solid rgba(224, 224, 224, 1)'
                                                    }} 
                                                    key={j}
                                                    align="center"
                                                    onClick={() => event.openGoogleCalendar(day)}
                                                >
                                                    {
                                                        props.googleSchedulesMap?.has(day.format(DateFormat.YYYYMMDD)) 
                                                        && props.googleSchedulesMap.get(day.format(DateFormat.YYYYMMDD))?.map((googleSchedule:GoogleSchedule) => {
                                                            if(googleSchedule.backgroundColor){
                                                                return(
                                                                    <Box>
                                                                        <Chip 
                                                                        label={googleSchedule.summary} 
                                                                        onClick={(e) => event.summaryClick(e,googleSchedule,day)} 
                                                                        style={{background:googleSchedule.backgroundColor}}
                                                                        />
                                                                    </Box>
                                                                )
                                                            }
                                                            
                                                            return(
                                                                <Typography onClick={(e) => event.summaryClick(e,googleSchedule,day)}>{googleSchedule.summary}</Typography>                                                                
                                                            )                                                            
                                                        })
                                                    }
                                                {props.publicHoliday[day.format(DateFormat.YYYYMMDD)] &&
                                                    <Typography>{props.publicHoliday[day.format(DateFormat.YYYYMMDD)]}</Typography>
                                                }
                                                {day.date()} 
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

export default CalendarDetail;