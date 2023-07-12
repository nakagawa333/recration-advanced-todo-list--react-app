import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { GoogleSchedule } from "../../types/googleSchedule";
import { Dispatch, SetStateAction, useEffect, useLayoutEffect, useState } from "react";
import { Dayjs } from "dayjs";
import DeleteIcon from '@mui/icons-material/Delete';
import axios, { AxiosRequestConfig, AxiosResponse, HttpStatusCode } from "axios";
import ClearIcon from '@mui/icons-material/Clear';
import SucessSnackbar from "../shared/SucessSnackbar";

type Props = {
  openFlag:boolean,
  setOpenFlag:Dispatch<SetStateAction<boolean>>
  setReloadFlag:Dispatch<SetStateAction<number>>
  googleSchedule:GoogleSchedule | null
  day:Dayjs | null
}

function GoogleSchedulesDetailModal(props:Props){
  const [snackBarOpen,setSnackBarOpen] = useState<boolean>(false);
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
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
        
        setSnackBarOpen(true);
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
          snackBarOpen={snackBarOpen}
          setSnackBarOpen={setSnackBarOpen}
          autoHideDuration={3000}
          message={"削除に成功しました"} 
        />      
        {
          props.openFlag
          &&
          <Modal
            open={props.openFlag}
            onClose={onClose}
          >
            <Box sx={{...style,maxWidth:400}}>
              <Box>
                <DeleteIcon 
                  onClick={deleteIconClick}
                />

                <ClearIcon
                onClick={onClose}
                />
              </Box>
              <Typography style={{fontSize:"20px"}}>{props.googleSchedule?.summary}</Typography>
              <Typography>
                {getDayInfo()}
              </Typography>
              <Typography>
                {props.googleSchedule?.start}
              </Typography>
              <Typography>
                {props.googleSchedule?.end}
              </Typography>
              <Typography>
                {props.googleSchedule?.eventType}
              </Typography>
              <Typography>
                {props.googleSchedule?.status}
              </Typography>
              <Typography>
                {props.googleSchedule?.description}
              </Typography>
            </Box>
          </Modal>
        }
      </>
  )
}

export default GoogleSchedulesDetailModal;