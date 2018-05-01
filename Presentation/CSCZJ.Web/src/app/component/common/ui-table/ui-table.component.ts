import { Component, OnInit,ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-ui-table',
  templateUrl: './ui-table.component.html',
  styleUrls: ['./ui-table.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class UiTableComponent implements OnInit {
  private dataRows:any[];
  pageIndex=1;

  total=2000;
  pageCount=0;
  pageSize='50';
  pp=50;
  pageSizes=[
    { value: '15', label: '15条/页' },
    { value: '50', label: '50条/页' },
    { value: '100', label: '100条/页' },
    { value: '200', label: '200条/页' },
    { value: '500', label: '500条/页' }
  ];


  constructor() { }

  ngOnInit() {
  }
  rows: any[] = [{
    name: '火锅',
    date: 2017,
    address: '上海市普陀区金沙江路 1518 弄',
  }, {
    name: '重庆小面',
    date: '2017-08-20',
    address: '上海市普陀区金沙江路 1518 弄',
  }, {
    name: '海蛎煎',
    date: '2017-08-21',
    address: '上海市普陀区金沙江路 1518 弄',
  }, {
    name: '榴莲酥',
    date: '2017-08-22',
    address: '上海市普陀区金沙江路 1510 弄',
  }]
  tableDataMore: any[] = []
  tableWithHTML: any[] = []

  handlePageSizeChange():void{
    console.log("123");
    this.pageCount=2000/parseInt(this.pageSize);
    this.pp=parseInt(this.pageSize);
  }

  handlePageIndexChange($evnent):void{
    //alert("model change");
    console.log("current pageIndex is "+this.pageIndex);
    console.log("event  pageSize is "+this.pageSize);

    console.log("event  total is "+this.total);
 
    console.log($evnent);
  }
}
