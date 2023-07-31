import { Dispatch, SetStateAction, useRef, useState } from "react";
import ErrorSnackbar from "../shared/ErrorSnackbar";
import SucessSnackbar from "../shared/SucessSnackbar";
import { GoogleSchedule } from "../../types/googleSchedule";
import { EventColors } from "../../types/eventColors";
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, TextField, Tooltip } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import {EditorState} from 'draft-js'
import { Editor } from "react-draft-wysiwyg";
import dayjs, { Dayjs } from "dayjs";
import { stateFromHTML } from "draft-js-import-html";
import { DateFormat } from "../../constants/Date";
import { UseGoogleSchedulesAddModalEvent } from "../../hooks/UseGoogleSchedulesAddModalEvent";
import { ReloadFlag } from "../../types/reloadFlag";


type Props = {
    openFlag:boolean,
    setOpenFlag:Dispatch<SetStateAction<boolean>>
    setReloadFlag:Dispatch<SetStateAction<ReloadFlag>>
    day:Dayjs
    eventColors:EventColors
}

//Googleスケジュール作成
function GoogleSchedulesAddModal(props:Props){
    //summary
    const summaryInputRef = useRef<HTMLInputElement>(null);
    //色
    const colorSelectRef = useRef<HTMLSelectElement>(null);

    const dateRef = useRef<any>(null);
    const startTimeRef = useRef<any>(null);
    const endTimeRef = useRef<any>(null);
    const [description,setDescription] = useState<string>("");

    const elementStore = EditorState.createEmpty();
    const [successSnackBarOpen,setSuccessSnackBarOpen] = useState<boolean>(false);
    const [errorSnackBarOpen,setErrorSnackBarOpen] = useState<boolean>(false);
    const [timeError,setTimeError] = useState<boolean>(false);

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width:"90%",
        maxWidth: "800px",
        bgcolor: 'background.paper',
        border: '2px solid var(--highlight-bg)',
        boxShadow: 24,
        outline:0,
        pt: 2,
        px: 4,
        pb: 3
    }

    //タイトル(summary)
    const startYYYYMMDD:string= props.day.format(DateFormat.YYYYMMDD);

    let [event] = UseGoogleSchedulesAddModalEvent(
        props.openFlag,
        description,
        props.setOpenFlag,
        props.setReloadFlag,
        setDescription,
        setTimeError,
        setSuccessSnackBarOpen,
        setErrorSnackBarOpen,
        props.eventColors,
        summaryInputRef,
        colorSelectRef,
        dateRef,
        startTimeRef,
        endTimeRef,
        elementStore
    );

    return(
        <>
          <SucessSnackbar  
            snackBarOpen={successSnackBarOpen}
            setSnackBarOpen={setSuccessSnackBarOpen}
            autoHideDuration={3000}
            message={"登録に成功しました"}             
          />
          
          <ErrorSnackbar 
            snackBarOpen={errorSnackBarOpen}
            setSnackBarOpen={setErrorSnackBarOpen}
            autoHideDuration={3000}
            message={"登録に失敗しました"}
          />
             <Modal
                open={props.openFlag}
                onClose={event.onClose}
              >
                    <Box sx={style}>
                        <Box style={{display:"flex",justifyContent:"flex-end"}}>
                        <Tooltip title="閉じる">
                            <IconButton>
                            <ClearIcon
                            onClick={event.onClose}
                            />
                            </IconButton>                  
                        </Tooltip>            
                        </Box>
                        <Box>
                            <TextField 
                              id="outlined-basic" 
                              label="タイトル" 
                              variant="outlined"
                              inputRef={summaryInputRef}
                              fullWidth
                              size="small"
                              onChange={(e) => event.summaryChange(e)}
                            />
                        </Box>

                        <Box style={{display:"flex",marginTop:"20px"}}>
                            <Box>
                                <TextField 
                                 type="date"
                                 defaultValue={startYYYYMMDD}
                                 size="small"
                                 inputRef={dateRef}
                                />                              
                            </Box>
                            <Box>
                                <TextField
                                    error={timeError}
                                    type="time"
                                    size="small"
                                    inputRef={startTimeRef}
                                    inputProps={{min:"00:00"}}
                                    helperText={startTimeRef?.current?.validationMessage}
                                />
                            </Box>
                            <Box>
                                <TextField 
                                    error={timeError}
                                    type="time"
                                    size="small"
                                    inputRef={endTimeRef}
                                    inputProps={{max:"23:59"}}
                                    helperText={endTimeRef?.current?.validationMessage}
                                />
                            </Box>
                        </Box>

                        <Box style={{marginTop:"20px"}}>
                            <FormControl>
                                <InputLabel id="demo-simple-select-label">色</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="color"
                                    size="small"
                                    inputProps={{maxWidth:"20px"}}
                                    inputRef={colorSelectRef}
                                >
                                    {
                                        Object.keys(props.eventColors).map((key:any,index:number) => {
                                            let backgroundColor:any = (props?.eventColors[key]?.background) ? props.eventColors[key].background : "";
                                            return(
                                                <MenuItem value={backgroundColor} key={index}>
                                                    <Box style={{
                                                        backgroundColor: backgroundColor,
                                                        borderRadius:"50%",
                                                        boxSizing:"border-box",
                                                        display:"inline-block",
                                                        outline:"none",
                                                        width:"18px",
                                                        height:"18px",
                                                        margin:"3px"
                                                    }}>
                                                     {/* {backgroundColor} */}
                                                    </Box>
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>                                
                        </Box>

                        <Box style={{marginTop:"20px"}}>
                            <Editor
                                defaultEditorState={elementStore}
                                toolbar={{
                                    options: ["inline","list","link"],
                                    inline: {
                                        options:["bold","italic","underline"]
                                    },
                                    list: {
                                        options: ["unordered","ordered"],
                                    },
                                    link: {
                                        options: ["link"],
                                    },
                                }}
                                localization={{
                                    locale: "ja",
                                }}
                                placeholder="ここに入力してください"
                                onEditorStateChange={(e) => event.editorChange(e)}
                            />
                        </Box>

                        <Box style={{display:"flex",justifyContent:"flex-end"}}>
                            <Button variant="contained" onClick={() => event.saveClick()}>
                                保存
                            </Button>
                        </Box>
                    </Box>
                </Modal>
        </>
    )
}

export default GoogleSchedulesAddModal;

