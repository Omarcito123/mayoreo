export class productoCar {
    idproduct: number;
    dateadd: string;
    datemod: string;
    existence: number;
    quantity: number;
    iduseradd: number;
    idusermod: number;
    productname: string;
    purchaseprice: number;
    saleprice: number;
    unitaverage: string;
    totalprice: number;

    constructor(idproduct: number, dateadd: string, datemod: string, existence: number, quantity: number, iduseradd: number, idusermod: number, productname: string, purchaseprice: number, saleprice: number, unitaverage: string, totalprice: number){
        this.idproduct = idproduct;
        this.dateadd = dateadd;
        this.datemod = datemod;
        this.existence = existence;
        this.quantity = quantity;
        this.iduseradd = iduseradd;
        this.idusermod = idusermod;
        this.productname = productname;
        this.purchaseprice = purchaseprice;
        this.saleprice = saleprice;
        this.unitaverage = unitaverage;
        this.totalprice = totalprice;
    }
}