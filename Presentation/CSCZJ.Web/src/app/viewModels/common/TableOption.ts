//表格页码选项
export class TablePageSize {
    index: number;
    size:number;
    total:number;
}

//列元数据
export class TableColumn {
  name: string;
  title:string;
  width:number;
  showSort:boolean;
  showFilter:boolean;
}  

//表格选项
export class TableOption
{
  pageSize:TablePageSize;
  columns:TableColumn[];
}