const express = require('express');
const fs = require('fs');
const { google } = require('googleapis')

//ファイル一覧
const GOOGLE_CALENDAR = require("./googleCalendar.json");

const app = express();
const PORT = 3004;

const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
const GOOGLE_PRIVATE_KEY = GOOGLE_CALENDAR.private_key;
const GOOGLE_CLIENT_EMAIL = GOOGLE_CALENDAR.client_email
const GOOGLE_PROJECT_NUMBER = GOOGLE_CALENDAR.google_project_number;
const GOOGLE_CALENDAR_ID = GOOGLE_CALENDAR.google_calendar_id;

let calendar = null;

app.listen(PORT, () => {
    try{
        const jwtClient = new google.auth.JWT(GOOGLE_CLIENT_EMAIL, null, GOOGLE_PRIVATE_KEY, SCOPES);
        calendar = google.calendar({
            version: 'v3',
            project: GOOGLE_PROJECT_NUMBER,
            auth: jwtClient,
        })

        let methodOptions = {
            calendarId: GOOGLE_CALENDAR_ID,
            timeMin: new Date().toISOString(),
            maxResults: 2500,
            singleEvents: true,
            orderBy: 'startTime'          
        }

        calendar.events.list(methodOptions,(error,result) => {
            if(error){
                console.error(error);
                console.error("カレンダー情報の取得に失敗しました");
            }

            console.info("カレンダー情報取得に成功しました");
            console.info(result.data.items);
        })

    } catch(error){
        console.error(error);
        console.error("サーバー起動失敗");
    }
});

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));