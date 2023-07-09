import { Component } from '@angular/core';
import { CommonService } from './common.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  getSub: any;

  constructor(public CommonService: CommonService) {
    this.CommonService.loading = false;
  }

  ngOnInit() {
    this.getInitialList();

  }

  getInitialList() {
    this.CommonService.loading = true;
    this.getSub = this.CommonService.getInitialList().subscribe((data: any) => {
      this.CommonService.loading = false;
      this.CommonService.bankList = data.initialData.bankList;
      this.CommonService.stateList = data.initialData.stateList;
      this.CommonService.organisation_typeList = data.initialData.organisation_typeList;
      this.CommonService.tilesList = data.initialData.tilesList;
      this.CommonService.dashboardHeader = data.initialData.dashboardHeader;
        this.CommonService.agentTileList = data.initialData.agentTileList;
        this.CommonService.userTileList = data.initialData.userTileList;
        this.CommonService.accountTileList = data.initialData.accountTileList;
        this.CommonService.polcyTileList = data.initialData.polcyTileList;
        this.CommonService.balanceRecordTileList = data.initialData.balanceRecordTileList;
        
        this.CommonService.hometilesListBelowcard = data.initialData.hometilesListBelowcard;

    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong" })
    });
  }
  ngOnDestroy() {
    if (this.getSub) {
      this.getSub.unsubscribe();
    }

  }


}
