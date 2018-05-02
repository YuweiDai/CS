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
  dataSet: any[] = []
  tableDataMore: any[] = []
  tableWithHTML: any[] = []

  constructor() { }

  ngOnInit() {
    for (let i = 0; i < 100; i++) {
      this.dataSet.push({
        name   : `Edward King ${i}`,
        age    : 32,
        address: `London, Park Lane no. ${i}`
      });
    }
  }
  

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
