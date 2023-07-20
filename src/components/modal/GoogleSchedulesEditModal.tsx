import { Dispatch, SetStateAction, useLayoutEffect, useRef, useState } from "react";
import { GoogleSchedule } from "../../types/googleSchedule";
import { EventColors } from "../../types/eventColors";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Badge, Button, FormControl, IconButton, InputLabel, MenuItem, Radio, Select, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import dayjs from "dayjs";
import { DateFormat } from "../../constants/Date";
import { Editor } from "react-draft-wysiwyg"
import { stateToHTML } from "draft-js-export-html";
import {stateFromHTML} from 'draft-js-import-html';

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { convertToRaw, EditorState,ContentState } from "draft-js";

type Props = {
    openFlag:boolean,
    setOpenFlag:Dispatch<SetStateAction<boolean>>
    googleSchedule:GoogleSchedule | null
    eventColors:EventColors
}

function GoogleSchedulesEditModal(props:Props){
    //summary
    const summaryInputRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<any>(null);
    const startTimeRef = useRef<any>(null);
    const endTimeRef = useRef<any>(null);
    const [description,setDescription] = useState<any>(props.googleSchedule?.description);

    const elementStore = description ? EditorState.createWithContent(stateFromHTML(description)) : EditorState.createEmpty();

    useLayoutEffect(() => {

        setDescription(props.googleSchedule?.description);
    },[props.openFlag])
    //description
    const descriptionEditorRef = useRef<any>(null);
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

    const summaryChange = (e:any) => {
        if(summaryInputRef?.current?.value && props?.googleSchedule?.summary){
            summaryInputRef.current.value = e.target.value;
        }
    }
    
    const onClose = () => {
        props.setOpenFlag(false);
    }

    //エディタの内容変更時
    const editorChange = (e:any) => {
        let description = stateToHTML(e.getCurrentContent());
        setDescription(description);
    }

    /**
     * 保存クリック時
     */
    const saveClick = () => {

    }
    
    return(
        <>
          {
            (props.openFlag && props.googleSchedule)
            &&
                <Modal
                    open={props.openFlag}
                    onClose={onClose}
                >
                    <Box sx={style}>
                        <Box style={{display:"flex",justifyContent:"flex-end"}}>
                        <Tooltip title="閉じる">
                            <IconButton>
                            <ClearIcon
                            onClick={onClose}
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
                              defaultValue={props.googleSchedule.summary}
                              fullWidth
                              size="small"
                              onChange={summaryChange}
                            />
                        </Box>

                        <Box style={{display:"flex",marginTop:"20px"}}>
                            <Box>
                                <TextField 
                                 type="date"
                                 defaultValue={dayjs(props.googleSchedule.start).format(DateFormat.YYYYMMDD)}
                                 size="small"
                                 inputRef={dateRef}
                                />                              
                            </Box>
                            <Box>
                                <TextField 
                                    type="time"
                                    defaultValue={dayjs(props.googleSchedule.start).format(DateFormat.HHmm)}
                                    size="small"
                                    inputRef={startTimeRef}
                                />
                            </Box>
                            <Box>
                                <TextField 
                                    type="time"
                                    defaultValue={dayjs(props.googleSchedule.end).format(DateFormat.HHmm)}
                                    size="small"
                                    inputRef={endTimeRef}
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
                                    defaultValue={props.googleSchedule.backgroundColor}
                                    size="small"
                                    inputProps={{maxWidth:"20px"}}
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
                            {/* <TextField 
                              id="outlined-basic" 
                              label="Outlined" 
                              variant="outlined"
                              value={props.googleSchedule.description}
                            />                             */}
                            <Editor
                                defaultEditorState={elementStore}
                                toolbar={{
                                    options: ["inline","list", "link"],
                                    inline: {
                                        // options: ["bold","oblique","Underline"],
                                        options:["bold","italic","underline"]
                                    },
                                    list: {
                                        options: ["unordered"],
                                    },
                                    link: {
                                        options: ["link"],
                                    },
                                }}
                                localization={{
                                    locale: "ja",
                                }}
                                placeholder="ここに入力してください"
                                onEditorStateChange={editorChange}
                                // editorRef={descriptionEditorRef}
                            />
                        </Box>

                        <Box style={{display:"flex",justifyContent:"flex-end"}}>
                            <Button variant="contained" onClick={saveClick}>
                                保存
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            }

        </>
    )
}

export default GoogleSchedulesEditModal;