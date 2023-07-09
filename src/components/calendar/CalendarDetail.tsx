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
    getPreAfterDayInfo:(targetBeginMonth:Dayjs,eventType:number) => void;
    getColor: (day:Dayjs,publicHoliday:any) => string;
    getBackGroudColor: (day:Dayjs,now:Dayjs) => string;
    getNowDayInfo:(startDay:Dayjs,endDay:Dayjs,now:Dayjs) => void;
}

//カレンダー詳細
function CalendarDetail(props:Props){
    const [openFlag,setOpenFlag] = useState<boolean>(false);
    const [googleSchedule,setGoogleSchedule] = useState<GoogleSchedule | null>(null);
    const summaryClick = (googleSchedule:GoogleSchedule) => {
        setGoogleSchedule(googleSchedule);
        setOpenFlag(true);
    }
    return(
        <>
            <GoogleSchedulesDetailModal 
              openFlag={openFlag}
              setOpenFlag={setOpenFlag}
              googleSchedule={googleSchedule}
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
                        props.calendars && props.calendars.map((arr:Dayjs[],index:number) => {
                                return(
                                    <TableBody key={index}>
                                    {
                                        arr.map((value:Dayjs,j:number) => {
                                            return (
                                                <TableCell 
                                                    style={{color:props.getColor(value,props.publicHoliday),
                                                        background:props.getBackGroudColor(value,props.now),
                                                        borderRight: '1px solid rgba(224, 224, 224, 1)'
                                                    }} 
                                                    key={j}
                                                    align="center"
                                                >
                                                    {
                                                        props.googleSchedulesMap?.has(value.format(DateFormat.YYYYMMDD)) 
                                                        && props.googleSchedulesMap.get(value.format(DateFormat.YYYYMMDD))?.map((googleSchedule:GoogleSchedule) => {
                                                            return(
                                                                <Typography onClick={() => summaryClick(googleSchedule)}>{googleSchedule.summary}</Typography>
                                                            )
                                                        })
                                                    }
                                                {props.publicHoliday[value.format(DateFormat.YYYYMMDD)] &&
                                                    <Typography>{props.publicHoliday[value.format(DateFormat.YYYYMMDD)]}</Typography>
                                                }
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

export default CalendarDetail;