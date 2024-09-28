export class Pageable{
    pageNumber:number;
    pageSize:number;
    offset:number;
    paged:boolean;
    unpaged:boolean;

    constructor(pageNumber:number,pageSize:number,offset:number,paged:boolean,unpaged:boolean){
        this.pageNumber=pageNumber;
        this.pageSize=pageSize;
        this.offset=offset;
        this.paged=paged;
        this.unpaged=unpaged;
    }
}