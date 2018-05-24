import { Component, OnInit,ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  encapsulation: ViewEncapsulation.None // None | Emulated | Native  暂时先不加属性限制 后期完善
})
export class HeaderComponent implements OnInit {
  data: any[] = [{
    value: 'logout',
    label: '退出登录',
  }]

  ngOnInit() {
  }

  handle(event: object): void {
    console.log(event);
  }
}