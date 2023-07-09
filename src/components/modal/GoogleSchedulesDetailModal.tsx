import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { GoogleSchedule } from "../../types/googleSchedule";
import { Dispatch, SetStateAction } from "react";

type Props = {
  openFlag:boolean,
  setOpenFlag:Dispatch<SetStateAction<boolean>>
  googleSchedule:GoogleSchedule | null
}

function GoogleSchedulesDetailModal(props:Props){
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
  return (
      <>
        {
          props.openFlag
          &&
          <Modal
            open={props.openFlag}
            // onClose={props.setOpenFlag(false)}
          >
            <Box sx={{...style,width:200}}>
              <Typography>Test</Typography>
            </Box>
          </Modal>
        }
      </>
  )
}

export default GoogleSchedulesDetailModal;