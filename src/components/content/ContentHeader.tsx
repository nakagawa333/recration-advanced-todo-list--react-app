import { Box, FormControl, InputLabel, Menu, MenuItem, Select, Typography } from "@mui/material"

type Props = {
    contentTitle:string,
    filtername:string,
    filterItems:string[]
}

function ContentHeader(props:Props){
    return(
        <Box style={{display:"flex"}}>
            <Box>
             <Typography style={{fontSize:"20px"}}>{props.contentTitle}</Typography>
            </Box>
        </Box>
    )
}

export default ContentHeader