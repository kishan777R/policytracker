import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { CommonService } from '../common.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-accounts',
  templateUrl: 'accounts.page.html',
  styleUrls: ['accounts.page.scss']
})
export class AccountsPage {

  public actionSheetButtons: any;
  getSub: any;
  showingListFor: any = undefined;
  deleteSub: any;
  idOfthePersonForWhomListIs: any = undefined;
  agent_or_user: any = { name: '' };
  getSubA: any;
  account_or_policy: any; headingP = 'Account';
  heading = 'Accounts';
  constructor(private actionSheetCtrl: ActionSheetController, public CommonService: CommonService, private router: Router, private route: ActivatedRoute) {
    this.CommonService.showTabMenu = false; this.CommonService.loading = false;
  }
  ngOnInit() {

    this.route.params.subscribe(paramsId => {
      this.showingListFor = paramsId['showingListFor'];
      this.idOfthePersonForWhomListIs = paramsId['idOfthePersonForWhomListIs'];
      this.account_or_policy = paramsId['account_or_policy'];
      if (this.CommonService.iwanttoshowPolicyUnderAccButNotBasedOnURL == -1) {
        if (this.account_or_policy == 'Policy') {
          this.heading = 'Policies'; this.headingP = 'Policy';
        } else {
          this.heading = 'Accounts'; this.headingP = 'Account';
        }
      } else {
        this.heading = 'Policies'; this.headingP = 'Policy';
      }
      this.CommonService.account_or_policy = paramsId['account_or_policy'];
    });

    this.CommonService.accountLastPage = 'List';



    if (this.CommonService.agentList) {
      this.getAgentInfo();
    } else {
      this.getAgentList();
    }

  }
  ionViewWillEnter() {
    this.CommonService.accountLastPage = 'List';

    if (this.CommonService.accountList) {


      if (this.CommonService.iwanttoshowPolicyUnderAccButNotBasedOnURL > -1) {
        this.getInfoOfThatAccountForWhichPolcyWillbeListed();
        this.CommonService.filterAccountListAccodingtoUserOrAgent('Account', this.CommonService.iwanttoshowPolicyUnderAccButNotBasedOnURL);

      } else {
        this.CommonService.filterAccountListAccodingtoUserOrAgent(this.showingListFor, this.idOfthePersonForWhomListIs);
      }
    }


    if (this.CommonService.whencomebacktoAccountListAfterSaveDoNeedToSendToDetails_variable_is_with_account_id != -1) {
      this.CommonService.loading = true;
      this.viewAccount(this.CommonService.whencomebacktoAccountListAfterSaveDoNeedToSendToDetails_variable_is_with_account_id, false)
    }

  }
  // ionViewWillEnter() {
  //   if (this.CommonService.whencomebacktoAccountListAfterSaveDoNeedToSendToDetails_variable_is_with_account_id!=-1 ) {
  //     this.router.navigate(['tabs/accounts/agentdetail/' +this.account_or_policy + '/' + this.showingListFor + '/' + this.idOfthePersonForWhomListIs + '/' + this.CommonService.whencomebacktoAccountListAfterSaveDoNeedToSendToDetails_variable_is_with_account_id]);

  //   }
  // }
  getAgentList(refresher: boolean = false) {
    if (!refresher) {
      this.CommonService.loading = true;
    }

    this.getSubA = this.CommonService.getAgentList().subscribe((data: any) => {
      this.CommonService.loading = false;

      this.CommonService.agentList = data;



      this.getAgentInfo();
    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong" })
    });
  }
  goingToAddEditpage = false;
  ionViewWillLeave() {
    if (!this.goingToAddEditpage) {
      this.CommonService.iwanttoshowPolicyUnderAccButNotBasedOnURL = -1;
    }


  }
  getAgentInfo() {
    this.CommonService.agentList.forEach((item: any) => {
      this.CommonService.agentListArrByIdAsKey[item.agent_id_int] = item;

    });
    this.agent_or_user = this.CommonService.agentListArrByIdAsKey[this.idOfthePersonForWhomListIs] || {name: ''};
    if (!this.CommonService.accountList || this.CommonService.accountList.length == 0) {
      this.getAccountList();
    }
    else {
      if (this.CommonService.iwanttoshowPolicyUnderAccButNotBasedOnURL > -1) {
        this.getInfoOfThatAccountForWhichPolcyWillbeListed();
        this.CommonService.filterAccountListAccodingtoUserOrAgent('Account', this.CommonService.iwanttoshowPolicyUnderAccButNotBasedOnURL);

      } else {
        this.CommonService.filterAccountListAccodingtoUserOrAgent(this.showingListFor, this.idOfthePersonForWhomListIs);
      }

    }
  }
  InfoOfThatAccountForWhichPolcyWillbeListed = { account_title: '' };
  getInfoOfThatAccountForWhichPolcyWillbeListed() {
    this.InfoOfThatAccountForWhichPolcyWillbeListed =  this.CommonService.accountListArrByIdAsKey[this.CommonService.iwanttoshowPolicyUnderAccButNotBasedOnURL];
      
  }

  getAccountList() {

    this.CommonService.loading = true;
    this.getSub = this.CommonService.getAccountList().subscribe((data: any) => {
      this.CommonService.loading = false;
      this.CommonService.accountList = data;

      if (this.CommonService.iwanttoshowPolicyUnderAccButNotBasedOnURL > -1) {
        this.getInfoOfThatAccountForWhichPolcyWillbeListed();
        this.CommonService.filterAccountListAccodingtoUserOrAgent('Account', this.CommonService.iwanttoshowPolicyUnderAccButNotBasedOnURL);

      } else {
        this.CommonService.filterAccountListAccodingtoUserOrAgent(this.showingListFor, this.idOfthePersonForWhomListIs);
      }

    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong" })
    });
  }


  ngOnDestroy() {
    if (this.getSub) {
      this.getSub.unsubscribe();
    } if (this.deleteSub) {
      this.deleteSub.unsubscribe();
    } if (this.getSubA) {
      this.getSubA.unsubscribe();
    }
  }
  editAccount(account_id_int: Number) {
    this.CommonService.accountLastPage = 'List';
    this.goingToAddEditpage = true;

    this.router.navigate(['tabs/accounts/accountsedit/' + this.account_or_policy + '/' + this.showingListFor + '/' + this.idOfthePersonForWhomListIs + '/' + account_id_int]);
  }
  viewAccount(account_id_int: Number, clicked: boolean) {
    this.goingToAddEditpage = true;
     this.router.navigate(['tabs/accounts/accountsdetail/' + this.account_or_policy + '/' + this.showingListFor + '/' + this.idOfthePersonForWhomListIs + '/' + account_id_int]);
  }
  deleteAccount(account_id_int: Number, extraaction: string) {

    let text = "Are you sure you want to delete this account ?";

    if (this.account_or_policy == 'Policy') {
      text = "Are you sure you want to delete this Policy ?";


    }

    if (confirm(text)) {
      this.CommonService.loading = true;
      this.deleteSub = this.CommonService.deleteAccount(account_id_int, extraaction).subscribe((data: any) => {
        this.CommonService.loading = false;
        if (data.status) {

          this.CommonService.accountList = data.AccountList;


          if (this.CommonService.iwanttoshowPolicyUnderAccButNotBasedOnURL > -1) {
            this.CommonService.filterAccountListAccodingtoUserOrAgent('Account', this.CommonService.iwanttoshowPolicyUnderAccButNotBasedOnURL);
          } else {
            this.CommonService.filterAccountListAccodingtoUserOrAgent(this.showingListFor, this.idOfthePersonForWhomListIs);
          }
          this.CommonService.policyList = undefined;
          this.CommonService.taskList = undefined;


          this.CommonService.message({ 'message': data.message, color: 'success' })
        } else {
          this.CommonService.message({ 'message': data.message, color: 'danger' })
        }
      }, (err: any) => {
        this.CommonService.loading = false;
        this.CommonService.message({ 'message': "Something is wrong" })
      });
    }
  }

  async deleteAccountActionSheet(account_id_int: Number) {

    let text1 = 'Keep policies and tasks under this account but without account detail  !';
    let headertext = "Please confirm following points before deleting " + this.account_or_policy + " !";
    let text2 = 'Delete policies and tasks  as well under this account ! ';

    if (this.account_or_policy == 'Policy') {
      text1 = 'Keep tasks under this Policy but without Policy detail  !';
      text2 = 'Delete tasks  as well under this Policy ! ';

    }
    this.actionSheetButtons = [
      {
        text: text1,
        handler: () => {
          this.deleteAccount(account_id_int, 'justdeleteaccount');
        },
        data: {
          action: 'delete',
        },
      },
      {
        text: text2,
        handler: () => {
          this.deleteAccount(account_id_int, 'deletePoliciesTasksForAccount');
        },
        data: {
          action: 'delete',
        },
      },
      {
        text: 'Cancel',
        role: 'cancel',
        data: {
          action: 'cancel',
        },
      },
    ];


    const actionSheet = await this.actionSheetCtrl.create({
      header: headertext,
      buttons: this.actionSheetButtons,
    });

    await actionSheet.present();
  }
}
