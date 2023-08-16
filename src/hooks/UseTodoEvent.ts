import axios, { AxiosRequestConfig, AxiosResponse, HttpStatusCode } from "axios";
import { Dayjs } from "dayjs";
import { Dispatch, SetStateAction } from "react";

type TodoEvent = {
    createTwoDimensionalArr:(arr:any[],num:number) => any[][];
    editClick:() => void;
    duplicateClick:() => void;
    deleteIconClick:(eventId:string) => void;
}

export const UseTodoEvent = (
    setSuccessSnackBarOpen:Dispatch<SetStateAction<boolean>>,
    setEditOpenFlag:Dispatch<SetStateAction<boolean>>,
    setEditDuplicateFlag:Dispatch<SetStateAction<boolean>>
):[TodoEvent] =>
{
    /**
     * 編集クリック
     */
    const editClick = () => {
        //編集モーダルを開く
        setEditOpenFlag(true);
    }

    /**
     * 複製クリック
     */
    const duplicateClick = () => {
        setEditDuplicateFlag(true);
    }

    /**
     * 削除アイコンクリック時
     * @param eventId イベントID
     * @returns 
     */
    const deleteIconClick = async(eventId:string) => {
        try{
            let backendUrl:string | undefined = process.env.REACT_APP_BACKEND_URL;
                if(backendUrl){
                    let axiosRequestConfig:AxiosRequestConfig = {
                        data:{
                            eventId:eventId
                        }
                    }
                    let res:AxiosResponse = await axios.delete(backendUrl + "calendars/delete",axiosRequestConfig);
                    let body = res.data.body;
                    if(res.data.statusCode !== HttpStatusCode.Ok){
                        return;
                    }
                    
                    setSuccessSnackBarOpen(true);
                    //props.setReloadFlag(2);
                }
            } catch(error:any){
                console.error(error.message,error);
                console.error("カレンダーの削除に失敗しました");
            }
    }
    
    /**
     * 配列から二次元配列を作成する
     * @param arr 配列
     * @param num 数値
     * @returns 二次元配列
     */
    const createTwoDimensionalArr = (arr:any[],num:number) => {
        let index:number = Math.round(arr.length / num);
        let twoDimensionalArr:any[][] = [];
        for(let i = 0; i < index; i++){
            twoDimensionalArr.push(arr.slice(i * num,(i + 1) * num));
        }
        return twoDimensionalArr;
    }

    return [{createTwoDimensionalArr,editClick,duplicateClick,deleteIconClick}];
}