import Toolbar from "@mui/material/Toolbar"
//ヘッダー
function Header(){
    const title = "Advanced Todo List";
    return (
        <Toolbar>
                <p style={{margin:"0 auto",fontSize:"25px"}}>
                    {title}
                </p>            
        </Toolbar>
    )
}

export default Header