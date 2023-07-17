import { Dispatch, SetStateAction, useLayoutEffect, useRef } from "react";
import { GoogleSchedule } from "../../types/googleSchedule";
import { EventColors } from "../../types/eventColors";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { IconButton, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import dayjs from "dayjs";
import { DateFormat } from "../../constants/Date";
import { Editor } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

type Props = {
    openFlag:boolean,
    setOpenFlag:Dispatch<SetStateAction<boolean>>
    googleSchedule:GoogleSchedule | null
    eventColors:EventColors
}

function GoogleSchedulesEditModal(props:Props){
    //summary
    const summaryInputRef = useRef<HTMLInputElement>(null);
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
                              onChange={summaryChange}
                            />
                        </Box>

                        <Box style={{display:"flex"}}>
                            <Box>
                                <TextField 
                                 type="date"
                                 defaultValue={dayjs(props.googleSchedule.start).format(DateFormat.YYYYMMDD)} 
                                />                              
                            </Box>
                            <Box>
                                <TextField 
                                    type="time"
                                    defaultValue={dayjs(props.googleSchedule.start).format(DateFormat.HHmm)}
                                />
                            </Box>
                            <Box>
                                <TextField 
                                    type="time"
                                    defaultValue={dayjs(props.googleSchedule.end).format(DateFormat.HHmm)}
                                />
                            </Box>
                        </Box>

                        <Box style={{marginTop:"10px"}}>
                            {/* <TextField 
                              id="outlined-basic" 
                              label="Outlined" 
                              variant="outlined"
                              value={props.googleSchedule.description}
                            />                             */}
                            <Editor
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
                                // localization={{
                                //     locale: "ja",
                                //   }}
                                placeholder="ここに入力してください"
                                // editorRef={descriptionEditorRef}
                            />
                        </Box>
                    </Box>
                </Modal>
            }

        </>
    )
}

export default GoogleSchedulesEditModal;