import { useEffect, useState } from "react"
import { Note } from "../entity/Note"
import axiosInstance from "../utils/AxiosInstance"
import { AxiosResponse } from "axios"
import APIResponse from "../entity/APIResponse"

export const TestPage=()=>{
    const [list,setList]=useState<Note[]>([])
    useEffect(()=>{
        axiosInstance.get('/note/get/all').then((response:AxiosResponse<APIResponse<Note[]>>)=>{
            console.log(response.data.data)
            setList(response.data.data)
        })
    },[])
    return (
        <>
        {list.map((value:Note)=>
            value.title
        )}
        </>
    )
}