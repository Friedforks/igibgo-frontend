import axios from "axios";
import {Constants} from "./Constants.tsx";

const axiosInstance = axios.create({
    baseURL: Constants.requestBaseUrl
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token){
        config.headers.token = token;
    }
    else{
        console.log("Token not found in localStorage");
    }
    return config;
}, error => {
    console.log("Error happend during axios request interceptor handling: ",error);
})
export default axiosInstance;