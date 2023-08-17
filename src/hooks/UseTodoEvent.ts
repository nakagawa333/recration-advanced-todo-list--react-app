import axios, { AxiosRequestConfig, AxiosResponse, HttpStatusCode } from "axios";
import { Dayjs } from "dayjs";
import { Dispatch, SetStateAction } from "react";
import { Api } from "../constants/Api";
import { Axios } from "../common/Axios";
import { ReloadFlag } from "../types/reloadFlag";

type TodoEvent = {
    createTwoDimensionalArr:(arr:any[],num:number) => any[][];
    editClick:() => void;
    duplicateClick:() => void;
    deleteIconClick:(eventId:string) => void;
}

export const UseTodoEvent = (
    setSuccessSnackBarOpen:Dispatch<SetStateAction<boolean>>,
    setErrorSnackBarOpen:Dispatch<SetStateAction<boolean>>,
    setEditOpenFlag:Dispatch<SetStateAction<boolean>>,
    setEditDuplicateFlag:Dispatch<SetStateAction<boolean>>,
    setShowCircularFlag:Dispatch<SetStateAction<boolean>>,
    setReloadFlag:Dispatch<SetStateAction<ReloadFlag>>
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
        setReloadFlag(2);
        try{
            //setShowCircularFlag(true);
            await Axios.deleteGoogleSchedule(eventId);

            setSuccessSnackBarOpen(true);

        } catch(error:any){
            setErrorSnackBarOpen(true);
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