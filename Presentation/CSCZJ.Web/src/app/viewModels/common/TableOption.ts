//表格页码选项
export class TablePageSize {
    pageIndex: number;
    pageSize:number;
    total:number;
    filterCount:number;
}

//列元数据
export class TableColumn {
  name: string;
  title:string;
  width:number;
  left:number;
  showSort?:boolean;
  showFilter?:boolean;
}  

//表格选项
export class TableOption
{
  pageSize?:TablePageSize;
  columns?:TableColumn[];
  nzScroll?:object;
}