import { FormControl, InputLabel, Menu, MenuItem, Select } from "@mui/material"

type Props = {
    contentTitle:string,
    filtername:string,
    filterItems:string[]
}

function ContentHeader(props:Props){
    return(
        <div style={{display:"flex"}}>
            <div>
             <p style={{fontSize:"20px"}}>{props.contentTitle}</p>
            </div>
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


        </div>
    )
}

export default ContentHeader