import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
 
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { AccountingPageRoutingModule } from './accounting-routing.module'; 
import { SharedModule } from '../shared/shared.module';
import { AccountingComponent } from './accounting/accounting.component';
import { AccountingAddComponent } from './accounting-add.component';


  @NgModule({
    imports: [
      IonicModule,
      CommonModule,
      FormsModule,
      ExploreContainerComponentModule,
      AccountingPageRoutingModule,SharedModule
  
    ],
    declarations: [AccountingComponent , AccountingAddComponent]
  })

 
export class AccountingModule {}
 