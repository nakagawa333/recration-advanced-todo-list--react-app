import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop/Backdrop';

type Props = {
    showFlag:boolean //表示フラグ
}

function CircularIndeterminate(props:Props){
    return(
        <>
          <Backdrop
            sx={{ color: 'rgba(0, 0, 0, 0.54)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={props.showFlag}
           >
            <CircularProgress color="inherit" />
           </Backdrop>
        </>
    )
}
export default CircularIndeterminate
