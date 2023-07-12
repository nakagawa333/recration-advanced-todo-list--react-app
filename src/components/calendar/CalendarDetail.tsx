import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, TableBody, Typography} from '@mui/material';
import { Dayjs } from 'dayjs';
import { DateFormat } from '../../constants/Date';
import { GoogleSchedule } from '../../types/googleSchedule';
import { Dispatch, SetStateAction, useState } from 'react';
import GoogleSchedulesDetailModal from '../modal/GoogleSchedulesDetailModal';

type Props = {
    yearNum:string //年号
    targetBeginMonth:Dayjs
    startDay:Dayjs
    endDay:Dayjs
    calendars:Dayjs[][] | undefined
    now:Dayjs
    publicHoliday:any
    googleSchedulesMap:Map<string, GoogleSchedule[]> | undefined
    setDetailModalFlag:Dispatch<SetStateAction<boolean>>
    setReloadFlag:Dispatch<SetStateAction<number>>
    getPreAfterDayInfo:(targetBeginMonth:Dayjs,eventType:number) => void;
    getColor: (day:Dayjs,publicHoliday:any) => string;
    getBackGroudColor: (day:Dayjs,now:Dayjs) => string;
    getNowDayInfo:(startDay:Dayjs,endDay:Dayjs,now:Dayjs) => void;
}

//カレンダー詳細
function CalendarDetail(props:Props){
    const [openFlag,setOpenFlag] = useState<boolean>(false);
    const [googleSchedule,setGoogleSchedule] = useState<GoogleSchedule | null>(null);
    const [day,setDay] = useState<Dayjs | null>(null);
    /**
     * サマリークリック時   
     * @param googleSchedule Googleスケジュール情報 
     * @param day 日時情報
     */
    const summaryClick = (googleSchedule:GoogleSchedule,day:Dayjs) => {
        setGoogleSchedule(googleSchedule);
        setOpenFlag(true);
        setDay(day);
    }
    return(
        <>
            <GoogleSchedulesDetailModal 
              openFlag={openFlag}
              setOpenFlag={setOpenFlag}
              setReloadFlag={props.setReloadFlag}
              googleSchedule={googleSchedule}
              day={day}
            />
            <Box>
                <Box style={{display:"flex"}}>
                    <Box>
                    <p>{props.yearNum}</p>
                    </Box>

                    <Box style={{display:"flex",margin:"auto"}}>
                        <Box style={{marginTop:"15px",marginRight:"20px"}}>
                        <ArrowBackIcon 
                        onClick={() => props.getPreAfterDayInfo(props.targetBeginMonth,1)}></ArrowBackIcon>
                        </Box>
                        
                        <p>{props.startDay.year()}年</p>
                        <p style={{marginLeft:"10px"}}>{props.targetBeginMonth.month() + 1}月</p>

                        <Box style={{marginTop:"15px",marginLeft:"20px"}}>
                            <ArrowForwardIcon 
                            onClick={() => props.getPreAfterDayInfo(props.targetBeginMonth,2)}>
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
                                                >
                                                    {
                                                        props.googleSchedulesMap?.has(day.format(DateFormat.YYYYMMDD)) 
                                                        && props.googleSchedulesMap.get(day.format(DateFormat.YYYYMMDD))?.map((googleSchedule:GoogleSchedule) => {
                                                            return(
                                                                <Typography onClick={() => summaryClick(googleSchedule,day)}>{googleSchedule.summary}</Typography>
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