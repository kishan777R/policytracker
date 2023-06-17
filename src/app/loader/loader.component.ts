import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../common.service';
 
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {

  constructor(public CommonService: CommonService) { }
    ngOnInit() { }

}

