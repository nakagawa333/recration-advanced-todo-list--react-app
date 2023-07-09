import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

type Props = {
    showFlag:boolean //表示フラグ
}

function CircularIndeterminate(props:Props){
    return(
        <>
            {props.showFlag && 
                (
                <Box>
                    <Box sx={{ display: 'flex',
                    position: 'absolute',
                    top:'50%',
                    left:'50%',
                    transform: 'translate(-50%, -50%)' }}>
                    <CircularProgress />
                    </Box>

                    <Box sx={{opacity:".5",
                      position: "fixed",
                      top:"0",
                      left:"0",
                      zIndex:"1040",
                      backgroundColor:"#000",
                      width:"100vw",
                      height:"100vh"
                    }}>

                    </Box>
                </Box>
                )
            }
        </>
    )
}
export default CircularIndeterminate
