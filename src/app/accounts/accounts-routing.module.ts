import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsPage } from './accounts.page';
import { AccountsAddPage } from './account-add.page';
import { AccountsDetailPage } from './account-detail.page';

const routes: Routes = [
  {
    path: ':account_or_policy/:showingListFor/:idOfthePersonForWhomListIs',
    component: AccountsPage,
  },
  {
    path: 'accountsadd/:account_or_policy/:showingListFor/:idOfthePersonForWhomListIs',
    component:AccountsAddPage,
  },
  
  {
    path: 'accountsedit/:account_or_policy/:showingListFor/:idOfthePersonForWhomListIs/:account_id_int',
    component:AccountsAddPage,
  }
  ,
  
  {
    path: 'accountsdetail/:account_or_policy/:showingListFor/:idOfthePersonForWhomListIs/:account_id_int',
    component: AccountsDetailPage,
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsPageRoutingModule {}
