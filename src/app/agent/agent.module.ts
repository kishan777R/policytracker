import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentPage } from './agent.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { AgentAddPage } from './agent-add.page';
import { AgentDetailPage } from './agent-detail.page';
import { FormsModule } from '@angular/forms';

import { AgentPageRoutingModule } from './agent-routing.module';
 import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    AgentPageRoutingModule,SharedModule

  ],
  declarations: [AgentPage, AgentAddPage, AgentDetailPage]
})
export class AgentPageModule { }
