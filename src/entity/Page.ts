import {Pageable} from "./Pageable.ts";

export class Page<T>{
    content:T;
    pageable:Pageable;
    last:boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    first: boolean;
    numberOfElements: number;
    empty: boolean;

    constructor(content:T,pageable:Pageable,last:boolean,totalElements: number,totalPages: number,size: number,first: boolean,numberOfElements: number,empty: boolean){
        this.content=content;
        this.pageable=pageable;
        this.last=last;
        this.totalElements=totalElements;
        this.totalPages=totalPages;
        this.size=size;
        this.first=first;
        this.numberOfElements=numberOfElements;
        this.empty=empty;
    }
}