import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { scheduler } from "timers/promises";

type Props = {
    schedules:any[]
}

function Todo(props:Props){
    return (
        <Box style={{display:"flex"}}>
            {
                props.schedules.map((schedule:any,index:number) => {
                    return(
                        <Box key={index}>
                            <Card variant="outlined" sx={{maxWidth:200}}>
                                <p>{schedule.summary}</p>
                                <p>ステータス:{schedule.status}</p>
                                <p>開始時間:</p>
                                <p>{schedule.start}</p>
                                <p>終了時間:</p>
                                <p>{schedule.end}</p>
                                <p>イベントの種類:{schedule.eventType}</p>
                                <p>説明:</p>
                                <textarea>
                                  {schedule.description}
                                </textarea>
                            </Card>
                        </Box>
                    )
                })
            } 
        </Box>
    )
}

export default Todo;