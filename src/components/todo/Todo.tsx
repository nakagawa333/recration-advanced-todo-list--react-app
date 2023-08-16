import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import React, { useLayoutEffect, useState } from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Typography from "@mui/material/Typography/Typography";
import CalendarMonthSharpIcon from '@mui/icons-material/CalendarMonthSharp';
import dayjs from "dayjs";
import { DateFormat } from "../../constants/Date";
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import CardContent from "@mui/material/CardContent/CardContent";
import Tooltip from "@mui/material/Tooltip/Tooltip";
import IconButton from "@mui/material/IconButton/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { UseTodoEvent } from "../../hooks/UseTodoEvent";
import { GoogleSchedule } from "../../types/googleSchedule";
import { Day } from "../../common/Day";


type Props = {
    schedules:any[]
}

function Todo(props:Props){
    const [successSnackBarOpen,setSuccessSnackBarOpen] = useState<boolean>(false);
    const [errorSnackBarOpen,setErrorSnackBarOpen] = useState<boolean>(false);

    const [editOpenFlag,setEditOpenFlag] = useState<boolean>(false);
    const [editDuplicateFlag,setEditDuplicateFlag] = useState<boolean>(false);
    
    const settings:Settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    const style = {
        width: 400,
        height:300
        // bgcolor: 'background.paper',
        // border: '2px solid var(--highlight-bg)',
        // boxShadow: 24,
        // outline:0,
        // pt: 2,
        // px: 4,
        // pb: 3,
    };

    const [event] = UseTodoEvent(
        setSuccessSnackBarOpen,
        setEditOpenFlag,
        setEditDuplicateFlag,
    );
    
    return (
            <Slider {...settings}>
                {
                    event.createTwoDimensionalArr(props.schedules,2).map((schedules:GoogleSchedule[],i:number) => {
                        return(
                            <Box key={i}>
                                <Box style={{"display":"flex","justifyContent":"space-around"}}>
                                    {
                                        schedules.map((schedule:GoogleSchedule,j:number) => {
                                            return (
                                                <Card variant="outlined" sx={style} key={j}>
                                                    <CardContent>
                                                        <Box style={{display:"flex",justifyContent:"flex-end"}}>
                                                            <Tooltip title="編集">
                                                                <IconButton>
                                                                    <EditIcon
                                                                    onClick={event.editClick}
                                                                    />
                                                                </IconButton>
                                                                </Tooltip>

                                                                <Tooltip title="複製">
                                                                <IconButton>
                                                                    <ContentCopyIcon
                                                                    onClick={event.duplicateClick}
                                                                    />
                                                                </IconButton>
                                                                </Tooltip>

                                                                <Tooltip title="削除">
                                                                <IconButton>
                                                                    <DeleteIcon
                                                                      onClick={() => event.deleteIconClick(schedule.eventId)}
                                                                    />
                                                                </IconButton>                  
                                                            </Tooltip>                                                  
                                                        </Box>
                                                        <Box>
                                                            <Typography style={{fontSize:"25px"}}>
                                                            {schedule.summary}
                                                            </Typography>
                                                        </Box>

                                                        <Box style={{display:"flex"}}>
                                                        <Box style={{color: "rgba(0, 0, 0, 0.54)",marginRight:"5px"}}>
                                                            <CalendarMonthSharpIcon />
                                                        </Box>

                                                        <Box>
                                                            <Typography>
                                                            {Day.getDayInfo(dayjs(schedule.start))}
                                                            </Typography>
                                                        </Box>
                                                        
                                                        <Box style={{display:"flex",marginLeft:"5px"}}>
                                                            <Typography>
                                                                {dayjs(schedule.start).format(DateFormat.HHmm)}
                                                            </Typography>
                                                            <Typography>
                                                                ～
                                                            </Typography>
                                                            <Typography>
                                                                {dayjs(schedule.end).format(DateFormat.HHmm)}
                                                            </Typography>
                                                        </Box>
                                                        </Box>

                                                        <Box style={{display:"flex"}}>
                                                            <Box>
                                                                <DescriptionRoundedIcon style={{color: "rgba(0, 0, 0, 0.54)"}}/>
                                                            </Box>
                                                            <Box>
                                                            <Typography>
                                                                <div dangerouslySetInnerHTML
                                                                    ={{__html: schedule.description}}
                                                                />
                                                            </Typography>
                                                            </Box>                          
                                                        </Box>

                                                        <Box style={{display:"flex"}}>
                                                            <Box>
                                                                <EventAvailableRoundedIcon style={{color: "rgba(0, 0, 0, 0.54)"}}/>
                                                            </Box>
                                                            <Box>
                                                              <Typography>
                                                                {schedule.eventType}
                                                              </Typography>
                                                            </Box>                                                
                                                        </Box>
                                                    </CardContent>
                                                </Card>                                                    
                                            )
                                        })
                                    }
                                </Box>
                            </Box>
                        )
                    })
                }
            </Slider>
    )
}

export default Todo;