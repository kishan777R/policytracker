import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentPage } from './agent.page';
import { AgentAddPage } from './agent-add.page';
import { AgentDetailPage } from './agent-detail.page';

const routes: Routes = [
  {
    path: ':working_for_user_or_agent',
    component: AgentPage,
  },
  
  {
    path: 'agentadd/:working_for_user_or_agent',
    component: AgentAddPage,
  },
  
  {
    path: 'agentedit/:working_for_user_or_agent/:agent_id_int',
    component: AgentAddPage,
  }
  ,
  
  {
    path: 'agentdetail/:working_for_user_or_agent/:agent_id_int',
    component: AgentDetailPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentPageRoutingModule {}
