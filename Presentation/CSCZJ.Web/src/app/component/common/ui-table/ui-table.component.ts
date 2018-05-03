import { Component, OnInit,ViewEncapsulation,Input } from '@angular/core';

import { TablePageSize,TableColumn,TableOption } from "../../../viewModels/common/TableOption";

@Component({
  selector: 'app-ui-table',
  templateUrl: './ui-table.component.html',
  styleUrls: ['./ui-table.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class UiTableComponent implements OnInit { 
  @Input() dataset:any[];
  @Input() tableOption:TableOption;


  pageSizes=[
    { value: '15', label: '15条/页' },
    { value: '50', label: '50条/页' },
    { value: '100', label: '100条/页' },
    { value: '200', label: '200条/页' },
    { value: '500', label: '500条/页' }
  ];
  
  constructor() { }

  ngOnInit() {
    // this.dataset=[];
    // for (let i = 0; i < 100; i++) {
    //   this.dataset.push({
    //     name   : `Edward King ${i}`,
    //     age    : 32,
    //     address: `London, Park Lane no. ${i}`
    //   });
    // }
    console.log(this.dataset);
  }
}
