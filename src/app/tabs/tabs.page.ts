import { Component } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  constructor(public CommonService: CommonService) {

  }
   
}
