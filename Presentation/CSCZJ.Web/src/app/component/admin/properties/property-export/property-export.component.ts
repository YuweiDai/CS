import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-property-export',
  templateUrl: './property-export.component.html',
  styleUrls: ['./property-export.component.less']
  
})
export class PropertyExportComponent implements OnInit {

  allChecked = false;
  indeterminate = true;
  unit = [
    { label: '常山县财政局', value: 'Apple', checked: false },
    { label: '常山县公路管理局', value: 'Pear', checked: false },
    { label: '常山县教育局', value: 'Orange', checked: false }
  ];
  Attributes= [
    { label: '名称', value: 'Apple', checked: false },
    { label: '地址', value: 'Pear', checked: false },
    { label: '所属单位', value: 'Orange', checked: false }
  ];


  constructor() { }

  updateAllUnitChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.unit.forEach(item => item.checked = true);
    } else {
      this.unit.forEach(item => item.checked = false);
    }
  }

  updateUnitChecked(): void {
    if (this.unit.every(item => item.checked === false)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.unit.every(item => item.checked === true)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }


  ngOnInit() {

  }

}
