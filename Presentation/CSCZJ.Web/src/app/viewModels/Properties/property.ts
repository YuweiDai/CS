//表格对象
export class PropertyListItem{
    id:number;
    name:string;
    propertyType:string;
    getMode?:string;
    address?:string;
    constructorArea?:number;
    landArea?:number;
    floor?:number;
    propertyId?:string;
    isAdmission:boolean;
    getedDate?:string;
    usedPeople?:string;
    fourToStation?:string;
    estateId?:string;
    constructId?:string;
    constructTime?:string;
    landId?:string;
    landTime?:string;
    currentType:string;
    useType:string;
    isMortgage:boolean;
    governmentId:number;
    governmentName:string;
    canEditDelete: boolean;   
    location:string;
}

//详细的资产对象
export class Property extends PropertyListItem {
    lon?:number;
    lat?:number;
    rents:PropertyRentModel[];
}

//新建资产对象
export class PropertyCreateModel
{    
    id:number;
    name:string;
    propertyTypeId:string;
    address:string;
    floor:number;
    fourToStation?:string;
    getedDate:string;   
    getModeId:string;
    isAdmission:string;
    registerEstate:string;
    estateId:string;
    estateTime:string;
    constructId:string;
    constructArea:number;
    constructTime:string;
    landId:string;
    landArea:number;
    landTime:string;
    landTimeStr:string;
    governmentId:string;
    governmentName:string;
    useTypeId:string;
    currentTypeId:string;
    isMortgage:string;
    description:string;
    logo:string;
    logoUrl:string;
    logoPictureId:number;
    location:string;
    extent:string;
    usedPeople:string;
    submit:boolean;
    pictures:PropertyPictureModel[];
    files:PropertyFileModel[];
    currentUse_Self:number
    currentUse_Rent:number
    currentUse_Lend:number
    currentUse_Idle:number
    owner_self:number
    owner_children:number
    price:number
    propertyNature:string
    landNature:string
    lifeTime:number 

    constructor(){
        this.name="";
        this.address="";
        this.floor=0;
        this.fourToStation="";
        this.getedDate="";   
        // this.getModeId="0";
        this.isAdmission="";
        //this.registerEstate="true";
        this.estateId="";
        this.estateTime="";
        this.constructId="";
        this.constructArea=0;
        this.constructTime="";
        this.landId="";
        this.landArea=0;
        this.landTime="";
        this.landTimeStr="";
        // this.useTypeId="0";
        // this.currentTypeId="0";
        this.isMortgage="";
        this.description="";
        this.logo="";
        this.logoUrl="";
        this.logoPictureId=0;
        this.location="";
        this.extent="";
        this.usedPeople="";
        this.submit=false;
        this.pictures=[];
        this.files=[];
        this.currentUse_Self=0;
        this.currentUse_Rent=0;
        this.currentUse_Lend=0;
        this.currentUse_Idle=0;
        this.owner_self=0;
        this.owner_children=0;
        this.price=0;
        this.propertyNature="";
        this.landNature="";
        this.lifeTime=0;        
        this.governmentName="";
    }
}

//资产图片模型
export class PropertyPictureModel
{
    pictureId:number;
    propertyId:number;
    displayOrder:number;
    title:string;
    href:string;
    isLogo:boolean;
}

//资产文件模型
export class PropertyFileModel
{
    fileId:number;
    propertyId:number;
    displayOrder:number;
    title:string;
    src:string;
    percentage:number;
    uploaded:boolean;
}

export class ApproveModel
{
    title:string;
    dSuggestion:string;
    dApproveDate:string;
    aSuggestion:string;
    aApproveDate:string;
    state:string;
    property_Id:number;
    submit:boolean;
}

export class PropertyRentModel extends ApproveModel
{
    id:number;
    name:string;
    rentTime:string;
    backTime:string;
    processDate:string;
    valid:boolean;
    priceString:string;
    priceList?:string[];
    rentArea:number;
    rentMonth:number;
    reamrk?:string;    
    rentPictures:PropertyPictureModel[];
    rentFiles:PropertyFileModel[];
}