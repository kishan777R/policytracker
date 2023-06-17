import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountsPage } from './accounts.page';
import { AccountsAddPage } from './account-add.page';
import { AccountsDetailPage } from './account-detail.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { AccountsPageRoutingModule } from './accounts-routing.module'; 
import { SharedModule } from '../shared/shared.module';


  @NgModule({
    imports: [
      IonicModule,
      CommonModule,
      FormsModule,
      ExploreContainerComponentModule,
      AccountsPageRoutingModule,SharedModule
  
    ],
    declarations: [AccountsPage, AccountsAddPage, AccountsDetailPage]
  })

 
export class AccountsPageModule {}
