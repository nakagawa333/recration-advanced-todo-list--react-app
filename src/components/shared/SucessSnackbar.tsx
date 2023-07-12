import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Dispatch, SetStateAction } from "react";

type Props = {
    autoHideDuration:number,
    message:string,
    snackBarOpen:boolean,
    setSnackBarOpen:Dispatch<SetStateAction<boolean>>
}

function SucessSnackbar(props:Props){

    const handleClose = () => {
        props.setSnackBarOpen(false);
    }
    return(
      <Snackbar
        open={props.snackBarOpen}
        autoHideDuration={props.autoHideDuration}
        onClose={handleClose}
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {props.message}
        </Alert>
      </Snackbar>
    )
}

export default SucessSnackbar;