import { Container } from "@mui/material";
import ContentHeader from "../content/ContentHeader"
import Header from "../shared/Header"
import Calendar from "../calendar/Calendar";
import { useState } from "react";
import Todo from "../todo/Todo";
import { GoogleSchedule } from "../../types/googleSchedule";
import CircularIndeterminate from "../circular/CircularIndeterminate";

function Home(){

    return(
        <>
          <Header/>
          <Container maxWidth="md">
            <ContentHeader
              contentTitle="Calendar"
            />

            <Calendar
               
            />

          </Container>
        </>
    )
}

export default Home