import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { GoogleSchedule } from "../../types/googleSchedule";
import { Dispatch, SetStateAction, useEffect, useLayoutEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import DeleteIcon from '@mui/icons-material/Delete';
import axios, { AxiosRequestConfig, AxiosResponse, HttpStatusCode } from "axios";
import ClearIcon from '@mui/icons-material/Clear';
import SucessSnackbar from "../shared/SucessSnackbar";
import ErrorSnackbar from "../shared/ErrorSnackbar";
import { DateFormat } from "../../constants/Date";
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CalendarMonthSharpIcon from '@mui/icons-material/CalendarMonthSharp';
import TitleSharpIcon from '@mui/icons-material/TitleSharp';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import { EventColors } from "../../types/eventColors";
import GoogleSchedulesEditModal from "./GoogleSchedulesEditModal";

type Props = {
  openFlag:boolean,
  setOpenFlag:Dispatch<SetStateAction<boolean>>
  setReloadFlag:Dispatch<SetStateAction<number>>
  googleSchedule:GoogleSchedule | null
  day:Dayjs | null
  eventColors:EventColors
}

function GoogleSchedulesDetailModal(props:Props){
  const [successSnackBarOpen,setSuccessSnackBarOpen] = useState<boolean>(false);
  const [errorSnackBarOpen,setErrorSnackBarOpen] = useState<boolean>(false);

  const [editOpenFlag,setEditOpenFlag] = useState<boolean>(false);
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid var(--highlight-bg)',
    boxShadow: 24,
    outline:0,
    pt: 2,
    px: 4,
    pb: 3,
  };
  
  const onClose = () => {
    props.setOpenFlag(false);
  }

  const getDayInfo = () => {
    if(props.day){
      return props.day?.month() + 1 + "月" + props.day?.date() + "日";
    }
    return "";
  }

  /**
   * 編集クリック
   */
  const editClick = () => {
    //編集モーダルを開く
    setEditOpenFlag(true);
  }

  /**
   * 削除アイコンクリック時
   * @returns 
   */
  const deleteIconClick = async() => {
    try{
      let backendUrl:string | undefined = process.env.REACT_APP_BACKEND_URL;
      if(backendUrl){
        let axiosRequestConfig:AxiosRequestConfig = {
          data:{
              eventId:props.googleSchedule?.eventId
          }
        }
        let res:AxiosResponse = await axios.delete(backendUrl + "calendars/delete",axiosRequestConfig);
        let body = res.data.body;
        if(res.data.statusCode !== HttpStatusCode.Ok){
          return;
        }
        
        setSuccessSnackBarOpen(true);
        props.setReloadFlag(2);
      }
    } catch(error:any){
      console.error(error.message,error);
      console.error("カレンダーの削除に失敗しました");
    } finally{
      onClose();
    }
  }

  return (
      <>
        <SucessSnackbar
          snackBarOpen={successSnackBarOpen}
          setSnackBarOpen={setSuccessSnackBarOpen}
          autoHideDuration={3000}
          message={"削除に成功しました"} 
        />

        <ErrorSnackbar
          snackBarOpen={errorSnackBarOpen}
          setSnackBarOpen={setErrorSnackBarOpen}
          autoHideDuration={3000}
          message={"削除に失敗しました"}
        />

        <GoogleSchedulesEditModal
          openFlag={editOpenFlag}
          setOpenFlag={setEditOpenFlag}
          googleSchedule={props.googleSchedule}
          eventColors={props.eventColors}
        />
        
        {
          props.openFlag
          &&
          <Modal
            disableEnforceFocus 
            open={props.openFlag}
            onClose={onClose}
          >
            <Box sx={style}>
              <Box style={{display:"flex",justifyContent:"flex-end"}}>
                <Tooltip title="編集">
                  <IconButton>
                    <EditIcon
                      onClick={editClick}
                    />
                  </IconButton>
                </Tooltip>

                <Tooltip title="複製">
                   <IconButton>
                    <ContentCopyIcon
                    />
                  </IconButton>                  
                </Tooltip>

                <Tooltip title="削除">
                   <IconButton>
                    <DeleteIcon 
                      onClick={deleteIconClick}
                    />
                  </IconButton>                  
                </Tooltip>

                <Tooltip title="閉じる">
                   <IconButton>
                    <ClearIcon
                      onClick={onClose}
                      />
                  </IconButton>                  
                </Tooltip>

              </Box>

              <Box style={{display:"flex",marginBottom:"10px"}}>    
                  <Typography style={{fontSize:"25px"}}>
                    {props.googleSchedule?.summary}
                  </Typography>
              </Box>
              <Box style={{display:"flex"}}>
                <Box style={{color: "rgba(0, 0, 0, 0.54)",marginRight:"5px"}}>
                   <CalendarMonthSharpIcon />
                </Box>
                <Box>
                  <Typography>
                    {getDayInfo()}
                  </Typography>
                </Box>
                <Box style={{display:"flex",marginLeft:"5px"}}>
                  <Typography>
                    {dayjs(props.googleSchedule?.start).format(DateFormat.HHmm)}
                  </Typography>
                  <Typography>
                    ～
                  </Typography>
                  <Typography>
                    {dayjs(props.googleSchedule?.end).format(DateFormat.HHmm)}
                  </Typography>
                </Box>
              </Box>

              {
                props.googleSchedule?.description && (
                    <Box style={{display:"flex"}}>
                      <Box>
                        <DescriptionRoundedIcon style={{color: "rgba(0, 0, 0, 0.54)"}}/>
                      </Box>   
                      <Box style={{marginLeft:"5px"}}>
                       <div dangerouslySetInnerHTML
                        ={{__html: props.googleSchedule.description}}
                        />
                      </Box>
                   </Box>
                )
              }
              <Box style={{display:"flex"}}>
                <Box>
                 <EventAvailableRoundedIcon style={{color: "rgba(0, 0, 0, 0.54)"}}/>
                </Box>
                <Box style={{marginLeft:"5px"}}>
                  <Typography>
                    {props.googleSchedule?.eventType}
                  </Typography> 
                </Box>
              </Box>
            </Box>
          </Modal>
        }
      </>
  )
}

export default GoogleSchedulesDetailModal;