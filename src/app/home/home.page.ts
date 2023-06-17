import { Component } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
 
  loading:boolean =false;

  constructor(public CommonService: CommonService) {
    this.CommonService.showTabMenu =true;
  }
  ngOnInit() {
     
  }
  
  ngOnDestroy() {
    
  }
  
}
