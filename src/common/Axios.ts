import axios, { AxiosRequestConfig, AxiosResponse, HttpStatusCode } from "axios";
import { Api } from "../constants/Api";
import { rejects } from "assert";

export class Axios{

    public static async getGoogleSchedule(){
        
    }
    /**
     * イベントIDに紐づくGoogleScheduleを削除する
     * @param eventId イベントID
     */
    public static async deleteGoogleSchedule(eventId:string):Promise<AxiosResponse>{
        let axiosRequestConfig:AxiosRequestConfig = {
            data:{
                eventId:eventId
            }
        }
        let res:AxiosResponse = await axios.delete(process.env.REACT_APP_BACKEND_URL + Api.ENDPOINT.CALENDARSDELETE,axiosRequestConfig);
        return res;
    }
}