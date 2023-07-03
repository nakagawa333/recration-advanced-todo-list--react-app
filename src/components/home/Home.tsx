import { Container } from "@mui/material";
import ContentHeader from "../content/ContentHeader"
import Header from "../shared/Header"
import Calendar from "../calendar/Calendar";
import { useState } from "react";
import Todo from "../todo/Todo";

function Home(){

  const filterItems:string[] = ["All","default"];

  const [schedules,setShedules] = useState<any[]>([]);
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
               schedules={schedules}
               setShedules={setShedules}
               setHoliday={setHoliday}           
            />
            <ContentHeader
              contentTitle="Today's todo"
              filtername="priority"
              filterItems={filterItems}
            />

            <Todo
               schedules={schedules}
            />
          </Container>
        </>
    )
}

export default Home