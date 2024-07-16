import { AxiosResponse } from "axios";
import APIResponse from "../entity/APIResponse";
import { FUser } from "../entity/FUser";
import ResponseCodes from "../entity/ResponseCodes";
import axiosInstance from "./AxiosInstance";

export const checkLoginStatus = async (): Promise<boolean> => {
    if (localStorage.getItem("token") !== null) {
        try {
            const response: AxiosResponse<APIResponse<FUser>> = await axiosInstance
                .post("/fuser/checkLogin", 0, {
                    params: {
                        token: localStorage.getItem("token"),
                    },
                })

            if (response.data.code == ResponseCodes.SUCCESS) {
                localStorage.setItem(
                    "userInfo",
                    JSON.stringify(response.data.data)
                );
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            console.log("Error happened during checkLoginStatus: ", error);
            return false;
        }
    }
    return false;
}

export const getUserInfo = ():FUser=> {
    return JSON.parse(localStorage.getItem("userInfo") as string) as FUser;
}