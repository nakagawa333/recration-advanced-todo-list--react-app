import { Box, FormControl, InputLabel, Menu, MenuItem, Select } from "@mui/material"

type Props = {
    contentTitle:string,
    filtername:string,
    filterItems:string[]
}

function ContentHeader(props:Props){
    return(
        <Box style={{display:"flex"}}>
            <Box>
             <p style={{fontSize:"20px"}}>{props.contentTitle}</p>
            </Box>
            <FormControl style={{marginLeft:"auto",minWidth:"200px"}}>
                <InputLabel id="demo-simple-select-label">{props.filtername}</InputLabel>
                <Select 
                    label={props.filtername}
                    size="medium"
                    variant="outlined"
                    >
                    {
                        props.filterItems.map((filterItem:string,index:number) => {
                            return(
                                <MenuItem>
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