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
}

//新建资产对象
export class PropertyCreateModel
{
    name:string;
    typeId:number;
    address:string;
    floor:number;
    fourToStation?:string;
    getedDate:string;
    getModelId:number;
    isAdmission:string;
    registerType:string;
    estateId:string;
    etateTime:string;
    constructId:string;
    constructArea:number;
    constructTime:string;
    landId:string;
    landArea:number;
    landTime:string;
    governmentId:number;
    useTypeId:number;
    currentTypeId:number;
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

    constructor(){
        
        this.floor=0;
        this.registerType="0";
        this.constructArea=1;
        this.landArea=1;
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