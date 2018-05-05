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
}

//详细的资产对象
export class Property extends PropertyListItem {
    lon?:number;
    lat?:number;
}