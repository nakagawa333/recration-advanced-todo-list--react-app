import { TableBody } from '@mui/material';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ja';
import '../../index.css';

function Calendar(){
    //日本の時刻に変換
    dayjs.locale('ja');
    //現在時刻
    const now:Dayjs = dayjs();
    const startDay:Dayjs = now.startOf("month").subtract(now.startOf("month").day(),"d");
    const endDay:Dayjs = now.endOf("month").add(6 - now.endOf("month").day() ,"d");

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

    /**
     * 色を取得する
     * @param dayjs 
     * @returns 色
     */
    const getColor = (dayjs:Dayjs) => {
        //土曜日
        if(dayjs.day() === 6){
            return "aqua";
        }

        //日曜日
        if(dayjs.day() === 0){
            return "red";
        }

        //祝日

        //それ以外
        return "black";
    }

    return(
        <>
        <div style={{display:"flex"}}>
            <div>
              <p>{yearNum}</p>
            </div>

            <div style={{display:"flex",margin:"auto"}}>
                <p>{startDay.year()}年</p>
                <p style={{marginLeft:"10px"}}>{startDay.month() + 1}月</p>                
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
                                        <TableCell style={{color:getColor(value)}} key={j}>{value.date()}</TableCell>
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
