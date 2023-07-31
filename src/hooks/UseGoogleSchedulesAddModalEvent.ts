import axios from "axios";
import dayjs from "dayjs";
import { stateToHTML } from "draft-js-export-html";
import { Day } from "../common/Day";
import { Dispatch, RefObject, SetStateAction } from "react";
import { GoogleSchedule } from "../types/googleSchedule";
import { EventColors } from "../types/eventColors";
import { EditorState } from "react-draft-wysiwyg";
import { ReloadFlag } from "../types/reloadFlag";

type GoogleSchedulesEditModalEvent = {
    onClose:() => void;
    editorChange:(e:any) => void;
    summaryChange:(e:any) => void;
    saveClick:() => void;
}

export const UseGoogleSchedulesAddModalEvent = (
    openFlag:boolean,
    description:any,
    setOpenFlag:Dispatch<SetStateAction<boolean>>,
    setReloadFlag:Dispatch<SetStateAction<ReloadFlag>>,
    setDescription:Dispatch<SetStateAction<string>>,
    setTimeError:Dispatch<SetStateAction<boolean>>,
    setSuccessSnackBarOpen:Dispatch<SetStateAction<boolean>>,
    setErrorSnackBarOpen:Dispatch<SetStateAction<boolean>>,
    eventColors:EventColors,
    summaryInputRef:RefObject<HTMLInputElement>,
    colorSelectRef:RefObject<HTMLSelectElement>,
    dateRef:RefObject<any>,
    startTimeRef:RefObject<any>,
    endTimeRef:RefObject<any>,
    elementStore:EditorState,
): [GoogleSchedulesEditModalEvent] => {
    
    /**
     * タイトル(サマリー)変更時
     * @param e 
     */
    const summaryChange = (e:any) => {
        if(summaryInputRef?.current?.value){
            summaryInputRef.current.value = e.target.value;
        }
    }

    /**
     * モーダルが閉じる際
     */
    const onClose = () => {
        //クローズ処理
        editModalClose();
    }

    //クローズ処理
    const editModalClose = () =>{
        //モーダルを閉じる
        setOpenFlag(false);
        //エラー初期化
        setTimeError(false);
    }

    /**
     * エディタの内容変更時
     * @param e 
     */
    const editorChange = (e:any) => {
        let description = stateToHTML(e.getCurrentContent());
        setDescription(description);
    }

    /**
     * 保存クリック時
     */
    const saveClick = async() => {
        //タイトル(summary)
        let summary:string | null = "";

        //日時
        let date = dateRef.current.value;
        //開始時刻
        let startTime = startTimeRef.current.value;
        //終了時刻
        let endTime = endTimeRef.current.value;
        //開始日時
        let startDate:string = `${date} ${startTime}`;
        //終了日時
        let endDate:string = `${date} ${endTime}`;

        if(!Day.compareStartToEndTime(startDate,endDate)){
            startTimeRef.current.setCustomValidity("開始時刻は終了時刻よりも前である必要があります。");
            endTimeRef.current.setCustomValidity("終了時刻は開始時刻よりも後である必要があります。");
            setTimeError(true);
            return;
        }

        //色
        let colorId:string | null = null;
        //イベントID
        // let eventId = googleSchedule?.eventId;

        if(summaryInputRef?.current?.value){
            summary = summaryInputRef.current.value;
        }

        if(colorSelectRef?.current?.value){
            let selectCurrentValue:string = colorSelectRef.current.value;
            Object.keys(eventColors).forEach((key:any) => {
                if(eventColors[key].background === selectCurrentValue){
                    colorId = key;
                    return;
                }
            })
        }

        let req = {
            requestBody:{
                summary:summary,
                colorId:colorId,
                description:description,
                start:{
                    dateTime:dayjs(startDate).format(""),
                    timeZone:"Asia/Tokyo"
                },
                end:{
                    dateTime:dayjs(endDate).format(""),
                    timeZone:"Asia/Tokyo"
                }
            }
        }

        let backendUrl:string | undefined = process.env.REACT_APP_BACKEND_URL;
        try{
            //更新処理
            let res = await axios.post(backendUrl + "calendars/insert",req);
            console.info("カレンダー登録処理",res);
            setSuccessSnackBarOpen(true);

            //編集モーダルを閉じる
            editModalClose();
            //画面ロード
            setReloadFlag(2);
        } catch(error:any){
            console.error(error.message,error);
            setErrorSnackBarOpen(true);
        }
    }

    return [{onClose,editorChange,summaryChange,saveClick}];    
}