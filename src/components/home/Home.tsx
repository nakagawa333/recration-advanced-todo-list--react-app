import { Container } from "@mui/material";
import ContentHeader from "../content/ContentHeader"
import Header from "../shared/Header"
import Calendar from "../calendar/Calendar";
import { useState } from "react";
import Todo from "../todo/Todo";

function Home(){

  const filterItems:string[] = ["月","日"];

  const [googleSchedules,setGoogleShedules] = useState<any[]>([]);
  const [holiday,setHoliday] = useState<any[]>([]);
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
               googleSchedules={googleSchedules}
               setGoogleShedules={setGoogleShedules}
               setHoliday={setHoliday}           
            />
            <ContentHeader
              contentTitle="This is Month's todo"
              filtername="priority"
              filterItems={filterItems}
            />

            <Todo
               schedules={googleSchedules}
            />
          </Container>
        </>
    )
}

export default Home