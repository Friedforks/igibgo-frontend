import ResponseCodes from "./ResponseCodes.ts";

class APIResponse<T>{
    code:ResponseCodes;
    message:string;
    data:T;

    constructor(code:ResponseCodes,message:string,data:T){
        this.code = code;
        this.message = message;
        this.data = data;
    }
}

export default APIResponse;