import { Container } from "@mui/material";
import ContentHeader from "../content/ContentHeader"
import Header from "../shared/Header"
import { DateRangeCalendar } from '@mui/x-date-pickers-pro';
import Calendar from "../calendar/Calendar";

function Home(){

  const filterItems:string[] = ["All","default"];
    return(
        <>
          <Header/>
          <Container maxWidth="md">
            <ContentHeader
              contentTitle="Calendar"
              filtername="Category"
              filterItems={filterItems}
            />

            <Calendar
              
            />
            <ContentHeader
              contentTitle="Today's todo"
              filtername="priority"
              filterItems={filterItems}
            />
          </Container>
        </>
    )
}

export default Home