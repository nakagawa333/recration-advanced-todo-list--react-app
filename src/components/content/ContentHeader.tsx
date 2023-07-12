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
            <FormControl style={{marginLeft:"auto",minWidth:"100px"}}>
                <InputLabel id="demo-simple-select-label">{props.filtername}</InputLabel>
                <Select 
                    label={props.filtername}
                    size="small"
                    variant="outlined"
                    defaultValue={props.filterItems[0]}
                    >
                    {
                        props.filterItems.map((filterItem:string,index:number) => {
                            return(
                                <MenuItem value={filterItem} key={index}>
                                    {filterItem}
                                </MenuItem>
                            )
                        })
                    }
                </Select>
            </FormControl>


        </Box>
    )
}

export default ContentHeader